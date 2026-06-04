from flask import Blueprint, request, jsonify
from models.database import db
from models.attendance import Attendance
from datetime import datetime
from models.employee import Employee

attendance_bp = Blueprint(
    "attendance",
    __name__
)

@attendance_bp.route("/checkin", methods=["POST"])
def check_in():
    try:
        data = request.json

        print("DATA RECEIVED:", data)

        attendance = Attendance(
            user_id=data.get("user_id"),
            check_in=datetime.now()
        )

        db.session.add(attendance)
        db.session.commit()

        return jsonify({
            "success": True,
            "message": "Checked In"
        })

    except Exception as e:
        print("CHECKIN ERROR:", str(e))

        return jsonify({
            "error": str(e)
        }), 500

@attendance_bp.route("/checkout", methods=["POST"])
def check_out():
    try:

        data = request.json
        print("CHECKOUT DATA:", data)

        attendance = Attendance.query.filter_by(
    user_id=data["user_id"],
    check_out=None
).order_by(
    Attendance.id.desc()
).first()

        print("ATTENDANCE:", attendance)

        if not attendance:
            return jsonify({
                "error": "No Check-In Found"
            }), 404

        attendance.check_out = datetime.now()

        print("CHECK IN:", attendance.check_in)
        print("CHECK OUT:", attendance.check_out)

        total_seconds = (
            attendance.check_out -
            attendance.check_in
        ).total_seconds()

        print("TOTAL SECONDS:", total_seconds)

        break_minutes = 0

        if attendance.lunch_break:
            break_minutes += 30

        if attendance.tea_break:
            break_minutes += 30

        total_seconds -= break_minutes * 60

        attendance.total_hours = round(
            total_seconds / 3600,
            2
        )

        print("TOTAL HOURS:", attendance.total_hours)

        db.session.commit()

        return jsonify({
            "success": True,
            "total_hours": attendance.total_hours
        })

    except Exception as e:
        print("CHECKOUT ERROR:", str(e))

        return jsonify({
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
        "check_in": attendance.check_in.isoformat()
    })




@attendance_bp.route("/lunch-break", methods=["POST"])
def lunch_break():

    data = request.json

    attendance = Attendance.query.filter_by(
        user_id=data["user_id"]
    ).order_by(
        Attendance.id.desc()
    ).first()

    if not attendance:
        return jsonify({
        "error": "No active attendance found"
        }), 404

    attendance.lunch_break = True
    db.session.commit()

    db.session.commit()

    return jsonify({
        "success": True
    })

@attendance_bp.route("/tea-break", methods=["POST"])
def tea_break():

    data = request.json

    attendance = Attendance.query.filter_by(
        user_id=data["user_id"]
    ).order_by(
        Attendance.id.desc()
    ).first()

    if not attendance:
        return jsonify({
        "error": "No active attendance found"
        }), 404

    attendance.tea_break = True
    db.session.commit()

    db.session.commit()

    return jsonify({
        "success": True
    })

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
            "date": record.attendance_date.strftime("%Y-%m-%d"),
            "checkIn": record.check_in.strftime("%I:%M %p") if record.check_in else "-",
            "checkOut": record.check_out.strftime("%I:%M %p") if record.check_out else "-",
            "workingHours": record.total_hours,
            "status": "Present"
        })

    return jsonify(result)

from models.attendance import Attendance
from models.employee import Employee

@attendance_bp.route("/", methods=["GET"])
def get_attendance():

    records = db.session.query(
        Attendance,
        Employee
    ).join(
        Employee,
        Attendance.user_id == Employee.user_id
    ).all()

    attendance_list = []

    for attendance, employee in records:

        attendance_list.append({
            "id": attendance.id,

            "user_id": attendance.user_id,

            "employee_name":
                f"{employee.first_name} {employee.last_name}",

            "department":
                employee.department,

            "designation":
                employee.designation,

            "check_in":
                attendance.check_in.strftime("%H:%M:%S")
                if attendance.check_in else None,

            "check_out":
                attendance.check_out.strftime("%H:%M:%S")
                if attendance.check_out else None,

            "total_hours":
                attendance.total_hours,

            "attendance_date":
                str(attendance.attendance_date)
        })

    return jsonify(attendance_list)