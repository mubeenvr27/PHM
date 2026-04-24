import { NextRequest, NextResponse } from "next/server";
import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    
    // The frontend sends { fullName, phone, email, programInterest, message }
    // We map this to the leads table schema.
    const type = "contact";
    const patient_name = body.fullName; 
    const email = body.email;
    const phone = body.phone;
    const condition_interest = Array.isArray(body.programInterest) 
      ? body.programInterest.join(", ") 
      : body.programInterest || null;
    const message = body.message;
    const source_page = "/contact";

    const insertQuery = `
      INSERT INTO leads (type, patient_name, email, phone, condition_interest, message, source_page)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING id;
    `;

    const values = [
      type,
      patient_name,
      email,
      phone,
      condition_interest,
      message,
      source_page,
    ];

    const result = await pool.query(insertQuery, values);

    return NextResponse.json(
      { success: true, message: "Contact lead successfully recorded.", id: result.rows[0].id },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error inserting contact lead into database:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error. Failed to record lead." },
      { status: 500 }
    );
  }
}
