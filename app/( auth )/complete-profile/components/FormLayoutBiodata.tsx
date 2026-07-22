"use client";

import React from "react";
import FormPersonalDetails from "./FormIIdentitas";
import FormAddressDetails from "./FormAlamat";
import FormContactDetails from "./FormDetailKontak";

interface StepPersonalAddressProps {
  firstName: string;
  setFirstName: (val: string) => void;
  lastName: string;
  setLastName: (val: string) => void;
  nik: string;
  setNik: (val: string) => void;
  jenisKelamin: "LAKI_LAKI" | "PEREMPUAN" | "LAINNYA" | "";
  setJenisKelamin: (val: "LAKI_LAKI" | "PEREMPUAN" | "LAINNYA" | "") => void;
  tanggalLahir: string;
  setTanggalLahir: (val: string) => void;
  fotoProfil: string;
  setFotoProfil: (val: string) => void;
  
  labelAlamat: string;
  setLabelAlamat: (val: string) => void;
  customLabelAlamat: string;
  setCustomLabelAlamat: (val: string) => void;
  alamatLengkap: string;
  provinsi: string;
  setProvinsi: (val: string) => void;
  kabupaten: string;
  setKabupaten: (val: string) => void;
  kecamatan: string;
  setKecamatan: (val: string) => void;
  kelurahan: string;
  setKelurahan: (val: string) => void;
  kodePos: string;
  setKodePos: (val: string) => void;
  catatanAlamat: string;
  setCatatanAlamat: (val: string) => void;
  latitude: number;
  longitude: number;
  
  nomorHp: string;
  setNomorHp: (val: string) => void;
  defaultEmail: string;
  
  handleAutoGPS: () => void;
  locating: boolean;
  setMapOpen: (val: boolean) => void;
  handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function StepPersonalAddress({
  firstName,
  setFirstName,
  lastName,
  setLastName,
  nik,
  setNik,
  jenisKelamin,
  setJenisKelamin,
  tanggalLahir,
  setTanggalLahir,
  fotoProfil,
  setFotoProfil,
  labelAlamat,
  setLabelAlamat,
  customLabelAlamat,
  setCustomLabelAlamat,
  alamatLengkap,
  provinsi,
  setProvinsi,
  kabupaten,
  setKabupaten,
  kecamatan,
  setKecamatan,
  kelurahan,
  setKelurahan,
  kodePos,
  setKodePos,
  catatanAlamat,
  setCatatanAlamat,
  latitude,
  longitude,
  nomorHp,
  setNomorHp,
  defaultEmail,
  handleAutoGPS,
  locating,
  setMapOpen,
  handleFileChange,
}: StepPersonalAddressProps) {
  return (
    <div className="space-y-10">
      
      {/* ── Sub-Group 1: Personal Details ── */}
      <FormPersonalDetails
        firstName={firstName}
        setFirstName={setFirstName}
        lastName={lastName}
        setLastName={setLastName}
        nik={nik}
        setNik={setNik}
        jenisKelamin={jenisKelamin}
        setJenisKelamin={setJenisKelamin}
        tanggalLahir={tanggalLahir}
        setTanggalLahir={setTanggalLahir}
        fotoProfil={fotoProfil}
        setFotoProfil={setFotoProfil}
        handleFileChange={handleFileChange}
      />

      {/* ── Sub-Group 2: Address Details ── */}
      <div className="pt-8 border-t border-slate-100">
        <FormAddressDetails
          labelAlamat={labelAlamat}
          setLabelAlamat={setLabelAlamat}
          customLabelAlamat={customLabelAlamat}
          setCustomLabelAlamat={setCustomLabelAlamat}
          alamatLengkap={alamatLengkap}
          provinsi={provinsi}
          setProvinsi={setProvinsi}
          kabupaten={kabupaten}
          setKabupaten={setKabupaten}
          kecamatan={kecamatan}
          setKecamatan={setKecamatan}
          kelurahan={kelurahan}
          setKelurahan={setKelurahan}
          kodePos={kodePos}
          setKodePos={setKodePos}
          catatanAlamat={catatanAlamat}
          setCatatanAlamat={setCatatanAlamat}
          latitude={latitude}
          longitude={longitude}
          handleAutoGPS={handleAutoGPS}
          locating={locating}
          setMapOpen={setMapOpen}
        />
      </div>

      {/* ── Sub-Group 3: Contact Details ── */}
      <div className="pt-8 border-t border-slate-100">
        <FormContactDetails
          nomorHp={nomorHp}
          setNomorHp={setNomorHp}
          defaultEmail={defaultEmail}
        />
      </div>

    </div>
  );
}
