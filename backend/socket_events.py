from flask_socketio import (
    emit,
    join_room
)

from models.database import db
from models.communication import Communication


def register_socket_events(socketio):

    # =====================================
    # JOIN EMPLOYEE ROOM
    # =====================================

    @socketio.on("join")
    def join(data):

        employee_id = str(
            data["employee_id"]
        )

        join_room(employee_id)

        print(
            f"Employee {employee_id} joined room"
        )

    # =====================================
    # SEND PRIVATE MESSAGE
    # =====================================

    @socketio.on("send_message")
    def send_message(data):

        try:

            sender_id = data.get(
                "sender_id"
            )

            receiver_id = data.get(
                "receiver_id"
            )

            sender_name = data.get(
                "sender_name"
            )

            message_text = data.get(
                "message"
            )

            # Save to PostgreSQL

            communication = Communication(

                employee_id=
                    sender_id,

                receiver_id=
                    receiver_id,

                employee_name=
                    sender_name,

                message_type=
                    "employee",

                message=
                    message_text,

                created_by=
                    sender_name
            )

            db.session.add(
                communication
            )

            db.session.commit()

            response = {

                "id":
                    communication.id,

                "employee_id":
                    sender_id,

                "receiver_id":
                    receiver_id,

                "employee_name":
                    sender_name,

                "message":
                    message_text,

                "message_type":
                    "employee",

                "created_by":
                    sender_name,

                "created_at":
                    str(
                        communication.created_at
                    )
            }

            # Send only to receiver

            emit(
                "receive_message",
                response,
                room=str(
                    receiver_id
                )
            )

            # Send back to sender

            emit(
                "message_sent",
                response
            )

        except Exception as e:

            db.session.rollback()

            emit(
                "message_error",
                {
                    "error":
                        str(e)
                }
            )