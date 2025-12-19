import db from "../config/db.js";

//Model for getting all admins from the database
export const findAllUsers = async () =>{
    const result = await db.query("SELECT * FROM admins");
    return result.rows;
}

//Model for getting a specific admins from the database using id
export const findUserByUid = async (id) =>{
    const query = "SELECT * FROM admins WHERE unique_id = $1";
    const values = [id];
    const result = await db.query(query, values);
    return result.rows[0];
};

export const findUserByMail = async (email) =>{
    const query = "SELECT * FROM admins WHERE email_address = $1";
    const values = [email];
    const result = await db.query(query, values);
    return result.rows[0];
};

//Model for creating a new admin user in the database
export const creatNewUser = async (name, email,  pNumber, password, userType, institution_id, date, unique_id) =>{
    const query = "INSERT INTO admins(name, email_address, phone_number, password, user_type, institution_unique_id,  date_joined, unique_id) VALUES ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING *";
    const values = [name, email,  pNumber, password, userType, institution_id, date, unique_id];
    const result = await db.query(query, values);
    return result.rows[0];
};

//Model for editing the admins data
export const editUserByUid = async (id, name, email, phone, userType) =>{
    const query = "UPDATE admins SET name=$1, email_address=$2, phone_number=$3, user_type=$4 WHERE unique_id = $5 RETURNING *";
    const values = [name, email, phone, userType, id];
    const result = await db.query(query, values);
    return result.rows[0];
};

export const editPasswordByMail = async (email, pwd) =>{
    const query = "UPDATE admins SET password=$1 WHERE email = $2 RETURNING *";
    const values = [email, pwd];
    const result = await db.query(query, values);
    return result.rows[0];
};