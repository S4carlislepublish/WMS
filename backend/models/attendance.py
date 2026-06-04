from models.database import db
from datetime import datetime


class Attendance(db.Model):

    __tablename__ = "attendance"

    id = db.Column(
        db.Integer,
        primary_key=True
    )

    user_id = db.Column(
        db.Integer,
        nullable=False
    )

    check_in = db.Column(
        db.DateTime,
        default=datetime.utcnow
    )

    check_out = db.Column(
        db.DateTime,
        nullable=True
    )

    lunch_break = db.Column(
        db.Boolean,
        default=False
    )

    tea_break = db.Column(
        db.Boolean,
        default=False
    )

    total_hours = db.Column(
        db.Float,
        default=0
    )

    attendance_date = db.Column(
        db.Date,
        default=datetime.utcnow().date
    )