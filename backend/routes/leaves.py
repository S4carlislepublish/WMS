from flask import Blueprint, request, jsonify
from models.database import db
from models.leave import LeaveRequest
from datetime import datetime
from models.employee import Employee

leave_bp = Blueprint(
    "leave",
    __name__
)

@leave_bp.route("/", methods=["POST"])
def apply_leave():

    try:

        data = request.json

        leave = LeaveRequest(

            employee_id=data["employee_id"],

            employee_name=data["employee_name"],

            leave_type=data["leave_type"],

            from_date=datetime.strptime(
                data["from_date"],
                "%Y-%m-%d"
            ).date(),

            to_date=datetime.strptime(
                data["to_date"],
                "%Y-%m-%d"
            ).date(),

            total_days=data["total_days"],

            reporting_manager=data["reporting_manager"],

            handover_to=data["handover_to"],

            emergency_contact=data[
                "emergency_contact"
            ],

            reason=data["reason"]
        )

        db.session.add(leave)
        db.session.commit()

        return jsonify({
            "success": True,
            "message": "Leave Applied Successfully"
        })

    except Exception as e:

        db.session.rollback()

        return jsonify({
            "success": False,
            "error": str(e)
        }), 500
    
@leave_bp.route("/", methods=["GET"])
def get_leaves():

    leaves = LeaveRequest.query.order_by(
        LeaveRequest.id.desc()
    ).all()

    return jsonify([
        {
            "id": leave.id,

            "employee_id":
                leave.employee_id,

            "employee_name":
                leave.employee_name,

            "leave_type":
                leave.leave_type,

            "from_date":
                str(leave.from_date),

            "to_date":
                str(leave.to_date),

            "total_days":
                leave.total_days,

            "reporting_manager":
                leave.reporting_manager,

            "status":
                leave.status,

            "reason":
                leave.reason
        }

        for leave in leaves
    ])

@leave_bp.route(
    "/approve/<int:leave_id>",
    methods=["PUT"]
)
def approve_leave(leave_id):

    try:

        leave = LeaveRequest.query.get(leave_id)

        if not leave:
            return jsonify({
                "success": False,
                "error": "Leave not found"
            }), 404

        print("Leave Employee ID:", leave.employee_id)

        employee = Employee.query.get(
            int(leave.employee_id)
        )

        if not employee:
            return jsonify({
                "success": False,
                "error": "Employee not found"
            }), 404

        # Prevent double approval
        if leave.status == "Approved":
            return jsonify({
                "success": False,
                "error": "Leave already approved"
            }), 400

        # Update leave status
        leave.status = "Approved"

        # Deduct leave balance
        if leave.leave_type == "Sick Leave":

            employee.sick_leave = max(
                0,
                employee.sick_leave - leave.total_days
            )

        elif leave.leave_type == "Casual Leave":

            employee.casual_leave = max(
                0,
                employee.casual_leave - leave.total_days
            )

        elif leave.leave_type == "Earned Leave":

            employee.earned_leave = max(
                0,
                employee.earned_leave - leave.total_days
            )

        db.session.commit()

        return jsonify({
            "success": True,
            "message": "Leave Approved Successfully",
            "leave_balance": {
                "sick_leave": employee.sick_leave,
                "casual_leave": employee.casual_leave,
                "earned_leave": employee.earned_leave,
                "total_balance":
                    employee.sick_leave +
                    employee.casual_leave +
                    employee.earned_leave
            }
        }), 200

    except Exception as e:

        db.session.rollback()

        return jsonify({
            "success": False,
            "error": str(e)
        }), 500


@leave_bp.route(
    "/reject/<int:leave_id>",
    methods=["PUT"]
)
def reject_leave(leave_id):

    leave = LeaveRequest.query.get(
        leave_id
    )

    if not leave:

        return jsonify({
            "error": "Leave not found"
        }), 404

    leave.status = "Rejected"

    db.session.commit()

    return jsonify({
        "success": True,
        "message": "Leave Rejected"
    })


@leave_bp.route(
    "/cancel/<int:leave_id>",
    methods=["PUT"]
)
def cancel_leave(leave_id):

    try:

        leave = LeaveRequest.query.get(
            leave_id
        )

        if not leave:
            return jsonify({
                "success": False,
                "error": "Leave not found"
            }), 404

        if leave.status == "Cancelled":
            return jsonify({
                "success": False,
                "error": "Already cancelled"
            }), 400

        leave.status = "Cancelled"

        db.session.commit()

        return jsonify({
            "success": True,
            "message": "Leave Cancelled Successfully"
        })

    except Exception as e:

        db.session.rollback()

        return jsonify({
            "success": False,
            "error": str(e)
        }), 500
    
@leave_bp.route(
    "/update/<int:leave_id>",
    methods=["PUT"]
)
def update_leave(leave_id):

    try:

        leave = LeaveRequest.query.get(
            leave_id
        )

        if not leave:
            return jsonify({
                "success": False
            }), 404

        data = request.json

        leave.leave_type = data["leave_type"]

        leave.from_date = datetime.strptime(
            data["from_date"],
            "%Y-%m-%d"
        ).date()

        leave.to_date = datetime.strptime(
            data["to_date"],
            "%Y-%m-%d"
        ).date()

        leave.reason = data["reason"]

        leave.total_days = data["total_days"]

        db.session.commit()

        return jsonify({
            "success": True,
            "message": "Leave Updated"
        })

    except Exception as e:

        db.session.rollback()

        return jsonify({
            "success": False,
            "error": str(e)
        }), 500