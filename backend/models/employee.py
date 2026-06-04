from models.database import db
from datetime import datetime


class Employee(db.Model):
    __tablename__ = "employees"

    id = db.Column(db.Integer, primary_key=True)

    user_id = db.Column(
    db.Integer,
    db.ForeignKey('users.id')
)
    
    

    employee_id = db.Column(db.String(50))

    first_name = db.Column(db.String(100))
    last_name = db.Column(db.String(100))

    email = db.Column(db.String(150))
    phone = db.Column(db.String(20))
    alternate_phone = db.Column(db.String(20))

    dob = db.Column(db.Date)
    gender = db.Column(db.String(20))
    marital_status = db.Column(db.String(30))
    blood_group = db.Column(db.String(10))

    address = db.Column(db.Text)
    city = db.Column(db.String(100))
    state = db.Column(db.String(100))
    country = db.Column(db.String(100))
    pincode = db.Column(db.String(20))

    department = db.Column(db.String(100))
    designation = db.Column(db.String(100))
    role = db.Column(db.String(100))

    joining_date = db.Column(db.Date)

    reporting_manager = db.Column(db.String(100))

    salary = db.Column(db.Float)

    bank_name = db.Column(db.String(150))
    account_number = db.Column(db.String(50))
    ifsc_code = db.Column(db.String(20))

    pan_number = db.Column(db.String(20))
    aadhaar_number = db.Column(db.String(20))

    qualification = db.Column(db.String(200))
    college = db.Column(db.String(200))
    passing_year = db.Column(db.String(10))
    percentage = db.Column(db.String(20))

    total_experience = db.Column(db.String(50))
    skills = db.Column(db.Text)

    emergency_contact_name = db.Column(db.String(150))
    emergency_contact_number = db.Column(db.String(20))

    status = db.Column(db.String(20))

    profile_completed = db.Column(
    db.Boolean,
    default=False
)
    profile_completed = db.Column(
    db.Boolean,
    default=False
)

    is_first_login = db.Column(
    db.Boolean,
    default=True
)