from flask import Blueprint, request, jsonify
from models.database import db
from models.attendance import Attendance
from datetime import datetime
from models.employee import Employee
from models.user import User
from datetime import date


attendance_bp = Blueprint(
    "attendance",
    __name__
)

@attendance_bp.route("/checkin", methods=["POST"])
def check_in():

    try:

        data = request.json

        today = datetime.now().date()

        attendance = Attendance.query.filter_by(
            user_id=data.get("user_id"),
            attendance_date=today
        ).first()

        if attendance:

            attendance.status = "Present"
            attendance.check_in = datetime.now()

        else:

            attendance = Attendance(
                user_id=data.get("user_id"),
                attendance_date=today,
                check_in=datetime.now(),
                status="Present"
            )

            db.session.add(attendance)

        db.session.commit()

        return jsonify({
            "success": True,
            "message": "Checked In"
        })

    except Exception as e:

        return jsonify({
            "error": str(e)
        }), 500

@attendance_bp.route("/checkout", methods=["POST"])
def check_out():

    try:

        data = request.json

        attendance = Attendance.query.filter_by(
            user_id=data["user_id"],
            check_out=None
        ).order_by(
            Attendance.id.desc()
        ).first()

        if not attendance:
            return jsonify({
                "success": False,
                "error": "No Check-In Found"
            }), 404

        attendance.check_out = datetime.now()

        total_seconds = (
            attendance.check_out -
            attendance.check_in
        ).total_seconds()

        total_seconds -= (
            (attendance.total_break_minutes or 0) * 60
        )

        attendance.total_hours = round(
            total_seconds / 3600,
            2
        )

        db.session.commit()

        return jsonify({
            "success": True,
            "total_hours": attendance.total_hours
        })

    except Exception as e:

        print("CHECKOUT ERROR:", str(e))

        return jsonify({
            "success": False,
            "error": str(e)
        }), 500

@attendance_bp.route("/status/<int:user_id>")
def attendance_status(user_id):

    attendance = Attendance.query.filter_by(
        user_id=user_id,
        check_out=None
    ).order_by(
        Attendance.id.desc()
    ).first()

    if not attendance:
        return jsonify({
            "checked_in": False
        })

    return jsonify({
    "checked_in": True,
    "check_in": attendance.check_in.isoformat(),

    "lunch_break":
        attendance.lunch_break,

    "tea_break":
        attendance.tea_break,

    "lunch_start":
        attendance.lunch_start.isoformat()
        if attendance.lunch_start
        else None,

    "tea_start":
        attendance.tea_start.isoformat()
        if attendance.tea_start
        else None
})




@attendance_bp.route(
    "/lunch-break",
    methods=["POST"]
)
def lunch_break():

    try:

        data = request.json

        attendance = Attendance.query.filter_by(
            user_id=data["user_id"],
            check_out=None
        ).order_by(
            Attendance.id.desc()
        ).first()

        if not attendance:
            return jsonify({
                "success": False,
                "error": "Attendance not found"
            }), 404

        action = data.get("action")

        if action == "start":

            attendance.lunch_break = True

            attendance.lunch_start = datetime.now()

        elif action == "stop":

            attendance.lunch_break = False

            attendance.lunch_end = datetime.now()

        if attendance.lunch_start:

             minutes = int(
            (
                attendance.lunch_end -
                attendance.lunch_start
            ).total_seconds() / 60
        )

        attendance.lunch_minutes = minutes

        if attendance.lunch_start:

                minutes = int(
                    (
                        attendance.lunch_end -
                        attendance.lunch_start
                    ).total_seconds() / 60
                )

                attendance.lunch_minutes = minutes

        attendance.total_break_minutes = (
            (attendance.lunch_minutes or 0) +
            (attendance.tea_minutes or 0)
        )

        db.session.commit()

        return jsonify({
            "success": True
        })

    except Exception as e:

        print("LUNCH BREAK ERROR:", str(e))

        return jsonify({
            "success": False,
            "error": str(e)
        }), 500

@attendance_bp.route(
    "/tea-break",
    methods=["POST"]
)
def tea_break():

    try:

        data = request.json

        attendance = Attendance.query.filter_by(
            user_id=data["user_id"],
            check_out=None
        ).order_by(
            Attendance.id.desc()
        ).first()

        if not attendance:
            return jsonify({
                "success": False,
                "error": "Attendance not found"
            }), 404

        action = data.get("action")

        if action == "start":

            attendance.tea_break = True

            attendance.tea_start = datetime.now()

        elif action == "stop":
            attendance.tea_break = False

            attendance.tea_end = datetime.now()

        if attendance.tea_start:

            minutes = int(
            (
                attendance.tea_end -
                attendance.tea_start
            ).total_seconds() / 60
        )

        attendance.tea_minutes = minutes

        if attendance.tea_start:

                minutes = int(
                    (
                        attendance.tea_end -
                        attendance.tea_start
                    ).total_seconds() / 60
                )

                attendance.tea_minutes = minutes

        attendance.total_break_minutes = (
            (attendance.lunch_minutes or 0) +
            (attendance.tea_minutes or 0)
        )

        db.session.commit()

        return jsonify({
            "success": True
        })

    except Exception as e:

        print("TEA BREAK ERROR:", str(e))

        return jsonify({
            "success": False,
            "error": str(e)
        }), 500

@attendance_bp.route("/history/<int:user_id>")
def attendance_history(user_id):

    records = Attendance.query.filter_by(
        user_id=user_id
    ).order_by(
        Attendance.id.desc()
    ).all()

    result = []

    for record in records:
        result.append({
    "id": record.id,
    "date":
    record.attendance_date.strftime("%Y-%m-%d")
    if record.attendance_date
    else "-",
    "checkIn": record.check_in.strftime("%I:%M %p") if record.check_in else "-",
    "checkOut": record.check_out.strftime("%I:%M %p") if record.check_out else "-",
    "workingHours": record.total_hours,
    "lunchMinutes": record.lunch_minutes,
    "teaMinutes": record.tea_minutes,
    "totalBreak": record.total_break_minutes,
    "status": record.status
})

    return jsonify(result)


@attendance_bp.route("/", methods=["GET"])
def get_attendance():

    today = datetime.now().date()

    employees = Employee.query.all()

    attendance_list = []

    for employee in employees:

        attendance = Attendance.query.filter_by(
            user_id=employee.user_id,
            attendance_date=today
        ).first()

        if attendance:

            status = attendance.status or "Present"

            check_in = (
                attendance.check_in.strftime("%H:%M:%S")
                if attendance.check_in
                else "-"
            )

            check_out = (
                attendance.check_out.strftime("%H:%M:%S")
                if attendance.check_out
                else "-"
            )

            total_hours = attendance.total_hours

        else:

            status = "Absent"
            check_in = "-"
            check_out = "-"
            total_hours = 0

        attendance_list.append({
            "user_id": employee.user_id,
            "employee_name": f"{employee.first_name} {employee.last_name}",
            "department": employee.department,
            "designation": employee.designation,
            "check_in": check_in,
            "check_out": check_out,
            "total_hours": total_hours,
            "attendance_date": str(today),
            "status": status
        })

    return jsonify(attendance_list)

@attendance_bp.route("/generate-daily-attendance")
def generate_daily_attendance():

    today = date.today()

    users = User.query.filter_by(
        is_active=True
    ).all()

    count = 0

    for user in users:

        existing = Attendance.query.filter_by(
            user_id=user.id,
            attendance_date=today
        ).first()

        if not existing:

            attendance = Attendance(
                user_id=user.id,
                attendance_date=today,
                status="Absent"
            )

            db.session.add(attendance)
            count += 1

    db.session.commit()

    return jsonify({
        "success": True,
        "records_created": count
    })