"use client";
import { db } from "@/app/firebase/config";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { addDoc, collection } from "firebase/firestore";
import React, { useState } from "react";

export default function page() {
  const [form, setForm] = useState({
    NomClient: "",
    dateEtHeure: "",
    NIF: "",
    Lieu: "",
    AnneeVehicule: "",
  });
  const handleChange = (key: keyof typeof form, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async () => {
    try {
      await addDoc(collection(db, "doc"), form);
      alert("Document ajouté avec succès");
      setForm({
        NomClient: "",
        dateEtHeure: "",
        NIF: "",
        Lieu: "",
        AnneeVehicule: "",
      });
    } catch (error) {
      console.error("Erreur Firestore:", error);
      alert("Erreur lors de l’ajout");
    }
  };
  return (
    <main className="flex items-center justify-center min-h-screen p-4 bg-gray-100">
      <div className="bg-white p-6 rounded-xl shadow w-full max-w-2xl">
        <h1 className="text-2xl font-semibold mb-6 text-center">
          Ajouter un client
        </h1>

        <div className="grid grid-cols-2 gap-4">
          <div className="grid gap-2">
            <p>Nom client.</p>
            <Input
              name=" NomClient"
              value={form.NomClient}
              onChange={(e) => handleChange("NomClient", e.target.value)}
              placeholder="Nom complet"
            />
          </div>
          <div className="grid gap-2">
            <p>NIF/CIN.</p>
            <Input
              name="NIF"
              value={form.NIF}
              onChange={(e) => handleChange("NIF", e.target.value)}
              placeholder="NIF ou CIN"
            />
          </div>
          <div className="grid gap-2">
            <p>Date & heure.</p>
            <Input
              name="dateEtHeure"
              value={form.dateEtHeure}
              onChange={(e) => handleChange("dateEtHeure", e.target.value)}
              placeholder="2025-04-18 10:30"
              type="datetime-local"
            />
          </div>
          <div className="grid gap-2">
            <p>Lieu</p>
            <Input
              name="Lieu"
              value={form.Lieu}
              onChange={(e) => handleChange("Lieu", e.target.value)}
              placeholder="Lieu"
            />
          </div>
          <div className="grid gap-2 col-span-2">
            <p>Année du véhicule.</p>
            <Input
              name="AnneeVehicule"
              value={form.AnneeVehicule}
              onChange={(e) => handleChange("AnneeVehicule", e.target.value)}
              placeholder="Ex: 2015"
              type="number"
            />
          </div>
          <p>etc...</p>
        </div>

        <div className="mt-6 text-center">
          <Button onClick={handleSubmit} className="px-6 py-2">
            Ajouter
          </Button>
        </div>
      </div>
    </main>
  );
}
