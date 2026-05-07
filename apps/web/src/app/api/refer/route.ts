import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    
    // The frontend sends { patientName, providerName, phone, email, programInterest, notes }
    // We map this to the leads table schema.
    const type = "referral";
    const patient_name = body.patientName;
    const provider_name = body.providerName;
    const email = body.email;
    const phone = body.phone;
    const condition_interest = Array.isArray(body.programInterest) 
      ? body.programInterest.join(", ") 
      : body.programInterest || null;
    const message = body.notes || null;
    const source_page = "/refer";

    const insertQuery = `
      INSERT INTO leads (type, patient_name, provider_name, email, phone, condition_interest, message, source_page)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING id;
    `;

    const values = [
      type,
      patient_name,
      provider_name,
      email,
      phone,
      condition_interest,
      message,
      source_page,
    ];

    const result = await query(insertQuery, values);

    return NextResponse.json(
      { 
        success: true, 
        message: "Patient referral successfully recorded.", 
        id: result.rows[0].id 
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error inserting referral lead into database:", error);
    return NextResponse.json(
      { 
        success: false, 
        message: "Internal server error. Failed to record referral." 
      },
      { status: 500 }
    );
  }
}
