import { NextResponse } from "next/server";

export const GET = async () => {
  return NextResponse.json({
    success: true,
    data: [],
    message: "Items fetched successfully",
  });
};
