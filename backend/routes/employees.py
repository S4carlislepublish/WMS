from flask import Blueprint, request, jsonify, Response
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
        data = request.form

        image = request.files.get(
        "profile_image"
        )

        image_data = None

        if image:
            image_data = image.read()

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
    profile_image=image_data,

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
            "user_id": emp.user_id,
            "employee_id": emp.employee_id,

            "first_name": emp.first_name,
            "last_name": emp.last_name,

            "email": emp.email,

            "department": emp.department,
            "designation": emp.designation,
            "role": emp.role,
            "salary": emp.salary,


            "reporting_manager": emp.reporting_manager,

            # Leave Balance
            "sick_leave": emp.sick_leave,
            "casual_leave": emp.casual_leave,
            "earned_leave": emp.earned_leave
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

    "profile_image": (
    True
    if employee.profile_image
    else False
),

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

    "pf_number": employee.pf_number,


"tenth_board": employee.tenth_board,
"twelfth_board": employee.twelfth_board,

"ug_university": employee.ug_university,
"pg_university": employee.pg_university,

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
    # 10th
"tenth_school": employee.tenth_school,
"tenth_percentage": employee.tenth_percentage,

# 12th
"twelfth_school": employee.twelfth_school,
"twelfth_percentage": employee.twelfth_percentage,

# UG
"ug_degree": employee.ug_degree,
"ug_college": employee.ug_college,
"ug_percentage": employee.ug_percentage,

# PG
"pg_degree": employee.pg_degree,
"pg_college": employee.pg_college,
"pg_percentage": employee.pg_percentage,

# Experience
"previous_company": employee.previous_company,

"current_ctc": employee.current_ctc,
"expected_ctc": employee.expected_ctc,

"notice_period": employee.notice_period,

# Work Details
"employee_type": employee.employee_type,
"work_location": employee.work_location,
"shift_timing": employee.shift_timing,

"probation_end_date": (
    employee.probation_end_date.isoformat()
    if employee.probation_end_date
    else None
),

# Emergency Contact
"emergency_contact_relation":
    employee.emergency_contact_relation,

    "total_experience": employee.total_experience,
    "skills": employee.skills,

    "emergency_contact_name": employee.emergency_contact_name,
    "emergency_contact_number": employee.emergency_contact_number,

    "status": employee.status,

    "profile_completed": employee.profile_completed,
    "is_first_login": employee.is_first_login,

    "user_id": employee.user_id,
    "sick_leave": employee.sick_leave,
"casual_leave": employee.casual_leave,
"earned_leave": employee.earned_leave
})



@employees_bp.route(
    "/image/<int:employee_id>",
    methods=["GET"]
)
def get_employee_image(employee_id):

    employee = Employee.query.get(
        employee_id
    )

    if not employee:
        return jsonify({
            "error": "Employee not found"
        }), 404

    if not employee.profile_image:
        return jsonify({
            "error": "No image found"
        }), 404

    return Response(
        employee.profile_image,
        mimetype="image/jpeg"
    )
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

        data = request.form

        resume = request.files.get("resume_file")
        aadhaar = request.files.get("aadhaar_file") 
        pan = request.files.get("pan_file")
        degree = request.files.get("degree_certificate")

        # Personal Details
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
        # PF
        employee.pf_number = data.get(
        "pf_number",
        employee.pf_number
    )

# Boards
        employee.tenth_board = data.get(
    "tenth_board",
    employee.tenth_board
   )

        employee.twelfth_board = data.get(
    "twelfth_board",
    employee.twelfth_board
)

# Universities
        employee.ug_university = data.get(
    "ug_university",
    employee.ug_university
)

        employee.pg_university = data.get(
        "pg_university",
        employee.pg_university
    )

        # Address
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

        # Banking
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

        # Identity
        employee.pan_number = data.get(
            "pan_number",
            employee.pan_number
        )

        employee.aadhaar_number = data.get(
            "aadhaar_number",
            employee.aadhaar_number
        )

        # Existing Education
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

        # 10th
        employee.tenth_school = data.get(
            "tenth_school",
            employee.tenth_school
        )

        employee.tenth_percentage = data.get(
            "tenth_percentage",
            employee.tenth_percentage
        )

        # 12th
        employee.twelfth_school = data.get(
            "twelfth_school",
            employee.twelfth_school
        )

        employee.twelfth_percentage = data.get(
            "twelfth_percentage",
            employee.twelfth_percentage
        )

        # UG
        employee.ug_degree = data.get(
            "ug_degree",
            employee.ug_degree
        )

        employee.ug_college = data.get(
            "ug_college",
            employee.ug_college
        )

        employee.ug_percentage = data.get(
            "ug_percentage",
            employee.ug_percentage
        )

        # PG
        employee.pg_degree = data.get(
            "pg_degree",
            employee.pg_degree
        )

        employee.pg_college = data.get(
            "pg_college",
            employee.pg_college
        )

        employee.pg_percentage = data.get(
            "pg_percentage",
            employee.pg_percentage
        )

        # Experience
        employee.total_experience = data.get(
            "total_experience",
            employee.total_experience
        )

        employee.previous_company = data.get(
            "previous_company",
            employee.previous_company
        )

        employee.current_ctc = (
        float(data["current_ctc"])
        if data.get("current_ctc")
        else None
        )

        employee.expected_ctc = (
        float(data["expected_ctc"])
        if data.get("expected_ctc")
        else None
)

        employee.notice_period = data.get(
            "notice_period",
            employee.notice_period
        )

        # Skills
        employee.skills = data.get(
            "skills",
            employee.skills
        )

        # Work Details
        employee.employee_type = data.get(
            "employee_type",
            employee.employee_type
        )

        employee.work_location = data.get(
            "work_location",
            employee.work_location
        )

        employee.shift_timing = data.get(
            "shift_timing",
            employee.shift_timing
        )

        if data.get("probation_end_date"):
            employee.probation_end_date = datetime.strptime(
                data["probation_end_date"],
                "%Y-%m-%d"
            ).date()

        # Emergency Contact
        employee.emergency_contact_name = data.get(
            "emergency_contact_name",
            employee.emergency_contact_name
        )

        employee.emergency_contact_number = data.get(
            "emergency_contact_number",
            employee.emergency_contact_number
        )

        employee.emergency_contact_relation = data.get(
            "emergency_contact_relation",
            employee.emergency_contact_relation
        )

        # Profile Status
        employee.profile_completed = True
        # Documents
        if resume:
            employee.resume_file = resume.read()

        if aadhaar:
            employee.aadhaar_file = aadhaar.read()

        if pan:
            employee.pan_file = pan.read()

        if degree:
            employee.degree_certificate = degree.read()
        employee.is_first_login = False

        db.session.commit()

        return jsonify({
            "success": True,
            "message": "Profile Updated Successfully"
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