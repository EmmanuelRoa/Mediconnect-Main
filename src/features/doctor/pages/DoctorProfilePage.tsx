import React from "react";
import { useParams } from "react-router-dom";

function DoctorProfilePage() {
  const { doctorId } = useParams();

  return <div>DoctorProfilePage - ID: {doctorId}</div>;
}

export default DoctorProfilePage;
