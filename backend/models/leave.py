from models.database import db
from datetime import datetime

class LeaveRequest(db.Model):
    __tablename__ = "leave_requests"

    id = db.Column(db.Integer, primary_key=True)


    employee_id = db.Column(db.String(50))
    employee_name = db.Column(db.String(200))

    leave_type = db.Column(db.String(100))

    from_date = db.Column(db.Date)
    to_date = db.Column(db.Date)

    total_days = db.Column(db.Integer)

    reporting_manager = db.Column(db.String(200))
    handover_to = db.Column(db.String(200))

    emergency_contact = db.Column(db.String(20))
    reason = db.Column(db.Text)

    status = db.Column(
        db.String(50),
        default="Pending"
    )

