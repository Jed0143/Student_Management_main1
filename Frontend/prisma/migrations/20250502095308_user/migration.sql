-- CreateEnum
CREATE TYPE "Role" AS ENUM ('admin', 'superadmin', 'parent');

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" "Role" NOT NULL,
    "preEnrollmentId" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PreEnrollment" (
    "id" SERIAL NOT NULL,

    CONSTRAINT "PreEnrollment_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_preEnrollmentId_fkey" FOREIGN KEY ("preEnrollmentId") REFERENCES "PreEnrollment"("id") ON DELETE SET NULL ON UPDATE CASCADE;