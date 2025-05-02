import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export const GET = async () => {
  return new NextResponse("Hello", {status: 200});
};

export const POST = () => {
  return new NextResponse("Hello", {status: 200});
};