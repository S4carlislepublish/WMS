from flask import Blueprint
from flask import request
from flask import jsonify

from sqlalchemy import or_

from models.database import db
from models.communication import Communication

communication_bp = Blueprint(
    "communication",
    __name__
)


# ==========================================
# SEND MESSAGE
# ==========================================

@communication_bp.route(
    "/",
    methods=["POST"]
)
def send_message():

    try:

        data = request.json

        communication = Communication(

            employee_id=data.get(
                "employee_id"
            ),

            receiver_id=data.get(
                "receiver_id"
            ),

            employee_name=data.get(
                "employee_name"
            ),

            message_type=data.get(
                "message_type",
                "employee"
            ),

            message=data.get(
                "message"
            ),

            created_by=data.get(
                "created_by"
            )
        )

        db.session.add(
            communication
        )

        db.session.commit()

        return jsonify({
            "success": True,
            "message": "Message Sent Successfully"
        })

    except Exception as e:

        db.session.rollback()

        return jsonify({
            "success": False,
            "error": str(e)
        }), 500


# ==========================================
# PRIVATE CHAT
# ==========================================

@communication_bp.route(
    "/employee/<int:employee_id>",
    methods=["GET"]
)
def get_employee_messages(employee_id):

    try:

        messages = Communication.query.filter(
            Communication.message_type == "employee",
            or_(
                Communication.employee_id == employee_id,
                Communication.receiver_id == employee_id
            )
        ).order_by(
            Communication.created_at.asc()
        ).all()

        return jsonify(
            [msg.to_dict() for msg in messages]
        )

    except Exception as e:

        return jsonify({
            "success": False,
            "error": str(e)
        }), 500

# ==========================================
# BIRTHDAY WISHES
# ==========================================

@communication_bp.route(
    "/birthday",
    methods=["GET"]
)
def get_birthday_messages():

    try:

        messages = Communication.query.filter_by(
            message_type="birthday"
        ).order_by(
            Communication.created_at.desc()
        ).all()

        return jsonify([
            msg.to_dict()
            for msg in messages
        ])

    except Exception as e:

        return jsonify({
            "success": False,
            "error": str(e)
        }), 500


# ==========================================
# HR ANNOUNCEMENTS
# ==========================================

@communication_bp.route(
    "/announcements",
    methods=["GET"]
)
def get_announcements():

    try:

        messages = Communication.query.filter_by(
            message_type="announcement"
        ).order_by(
            Communication.created_at.desc()
        ).all()

        return jsonify([
            msg.to_dict()
            for msg in messages
        ])

    except Exception as e:

        return jsonify({
            "success": False,
            "error": str(e)
        }), 500


# ==========================================
# DELETE MESSAGE
# ==========================================

@communication_bp.route(
    "/<int:message_id>",
    methods=["DELETE"]
)
def delete_message(
    message_id
):

    try:

        message = Communication.query.get(
            message_id
        )

        if not message:

            return jsonify({
                "success": False,
                "error": "Message Not Found"
            }), 404

        db.session.delete(
            message
        )

        db.session.commit()

        return jsonify({
            "success": True,
            "message": "Deleted Successfully"
        })

    except Exception as e:

        db.session.rollback()

        return jsonify({
            "success": False,
            "error": str(e)
        }), 500