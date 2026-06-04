from flask import Blueprint, request, jsonify
from models.database import db
from models.employee import Employee
from datetime import datetime
import traceback

employees_bp = Blueprint("employees", __name__)


# ======================================
# HR CREATE EMPLOYEE
# ======================================
@employees_bp.route("/", methods=["POST"])
def create_employee():
    try:
        data = request.json

        joining_date = None
        if data.get("joining_date"):
            joining_date = datetime.strptime(
                data["joining_date"],
                "%Y-%m-%d"
            ).date()

        employee = Employee(
    employee_id=data.get("employee_id"),
    first_name=data.get("first_name"),
    last_name=data.get("last_name"),
    email=data.get("email"),
    phone=data.get("phone"),

    department=data.get("department"),
    designation=data.get("designation"),
    role=data.get("role"),

    reporting_manager=data.get(
        "reporting_manager"
    ),

    joining_date=joining_date,

    salary=float(data.get("salary", 0)),

    profile_completed=False,
    is_first_login=True,
    status="Active"
)

        db.session.add(employee)
        db.session.commit()

        return jsonify({
            "success": True,
            "message": "Employee Created Successfully",
            "employee_id": employee.employee_id,
            "id": employee.id
        }), 201

    except Exception as e:
        traceback.print_exc()
        db.session.rollback()

        return jsonify({
            "success": False,
            "error": str(e)
        }), 500
    


# ======================================
# GET ALL EMPLOYEES
# FOR ADMIN DROPDOWN
# ======================================
@employees_bp.route("/", methods=["GET"])
def get_employees():

    employees = Employee.query.all()

    return jsonify([
        {
            "id": emp.id,
            "employee_id": emp.employee_id,
            "first_name": emp.first_name,
            "last_name": emp.last_name,
            "email": emp.email,
            "department": emp.department,
            "designation": emp.designation,
            "role": emp.role,
            "reporting_manager": emp.reporting_manager
        }
        for emp in employees
    ])

# ======================================
# GET SINGLE EMPLOYEE
# ======================================
@employees_bp.route("/<int:employee_id>", methods=["GET"])
def get_employee(employee_id):

    employee = Employee.query.get(employee_id)

    if not employee:
        return jsonify({
            "error": "Employee not found"
        }), 404

    return jsonify({
    "id": employee.id,
    "employee_id": employee.employee_id,

    "first_name": employee.first_name,
    "last_name": employee.last_name,

    "email": employee.email,
    "phone": employee.phone,
    "alternate_phone": employee.alternate_phone,

    "department": employee.department,
    "designation": employee.designation,
    "role": employee.role,

    "joining_date": (
        employee.joining_date.isoformat()
        if employee.joining_date else None
    ),

    "reporting_manager": employee.reporting_manager,

    "salary": employee.salary,

    "dob": (
        employee.dob.isoformat()
        if employee.dob else None
    ),

    "gender": employee.gender,
    "marital_status": employee.marital_status,
    "blood_group": employee.blood_group,

    "address": employee.address,
    "city": employee.city,
    "state": employee.state,
    "country": employee.country,
    "pincode": employee.pincode,

    "bank_name": employee.bank_name,
    "account_number": employee.account_number,
    "ifsc_code": employee.ifsc_code,

    "pan_number": employee.pan_number,
    "aadhaar_number": employee.aadhaar_number,

    "qualification": employee.qualification,
    "college": employee.college,
    "passing_year": employee.passing_year,
    "percentage": employee.percentage,

    "total_experience": employee.total_experience,
    "skills": employee.skills,

    "emergency_contact_name": employee.emergency_contact_name,
    "emergency_contact_number": employee.emergency_contact_number,

    "status": employee.status,

    "profile_completed": employee.profile_completed,
    "is_first_login": employee.is_first_login,

    "user_id": employee.user_id
})


# ======================================
# EMPLOYEE PROFILE UPDATE
# ======================================
@employees_bp.route("/<int:employee_id>", methods=["PATCH"])
def update_employee_profile(employee_id):

    try:
        employee = Employee.query.get(employee_id)

        if not employee:
            return jsonify({
                "error": "Employee not found"
            }), 404

        data = request.json

        # DOB
        if data.get("dob"):
            employee.dob = datetime.strptime(
                data["dob"],
                "%Y-%m-%d"
            ).date()

        employee.gender = data.get(
            "gender",
            employee.gender
        )

        employee.marital_status = data.get(
            "marital_status",
            employee.marital_status
        )

        employee.blood_group = data.get(
            "blood_group",
            employee.blood_group
        )

        employee.address = data.get(
            "address",
            employee.address
        )

        employee.city = data.get(
            "city",
            employee.city
        )

        employee.state = data.get(
            "state",
            employee.state
        )

        employee.country = data.get(
            "country",
            employee.country
        )

        employee.pincode = data.get(
            "pincode",
            employee.pincode
        )

        employee.bank_name = data.get(
            "bank_name",
            employee.bank_name
        )

        employee.account_number = data.get(
            "account_number",
            employee.account_number
        )

        employee.ifsc_code = data.get(
            "ifsc_code",
            employee.ifsc_code
        )

        employee.pan_number = data.get(
            "pan_number",
            employee.pan_number
        )

        employee.aadhaar_number = data.get(
            "aadhaar_number",
            employee.aadhaar_number
        )

        employee.qualification = data.get(
            "qualification",
            employee.qualification
        )

        employee.college = data.get(
            "college",
            employee.college
        )

        employee.passing_year = data.get(
            "passing_year",
            employee.passing_year
        )

        employee.percentage = data.get(
            "percentage",
            employee.percentage
        )

        employee.total_experience = data.get(
            "total_experience",
            employee.total_experience
        )

        employee.skills = data.get(
            "skills",
            employee.skills
        )

        employee.emergency_contact_name = data.get(
            "emergency_contact_name",
            employee.emergency_contact_name
        )

        employee.emergency_contact_number = data.get(
            "emergency_contact_number",
            employee.emergency_contact_number
        )

        employee.profile_completed = True
        employee.is_first_login = False

        db.session.commit()

        return jsonify({
            "success": True,
            "message": "Profile Completed Successfully"
        })

    except Exception as e:
        traceback.print_exc()
        db.session.rollback()

        return jsonify({
            "success": False,
            "error": str(e)
        }), 500
    
@employees_bp.route('/list', methods=['GET'])
def get_employees_list():
    employees = Employee.query.all()

    return jsonify([
        {
            "id": emp.id,
            "employee_id": emp.employee_id,
            "name": f"{emp.first_name} {emp.last_name}",
            "department": emp.department,
            "designation": emp.designation,
            "role": emp.role
        }
        for emp in employees
    ])
    
@employees_bp.route('/test')
def test():
    return jsonify({"message":"working"})

print("Employees Blueprint Loaded")