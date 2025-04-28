"use client";
import { db } from "@/app/firebase/config";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { addDoc, collection } from "firebase/firestore";
import React, { useState } from "react";

export default function page() {
  const [form, setForm] = useState({
    Nom: "",
    Prenom: "",
    dateEtHeure: "",
    NIF: "",
    Adresse: "",
    Phone: "",
    Email: "",
    nomVehicule: "",
    MarqueVehicule: "",
    Moteur: "",
    Serie: "",
    Type: "",
    Couleur: "",
    Plaque: "",
    Annee: "",
    Puissance: "",
    ancPolice: "",
  });
  const handleChange = (key: keyof typeof form, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async () => {
    try {
      await addDoc(collection(db, "doc"), form);
      alert("Document ajouté avec succès");
      setForm({
        Nom: "",
        Prenom: "",
        dateEtHeure: "",
        NIF: "",
        Adresse: "",
        Phone: "",
        Email: "",
        nomVehicule: "",
        MarqueVehicule: "",
        Moteur: "",
        Serie: "",
        Type: "",
        Couleur: "",
        Plaque: "",
        Annee: "",
        Puissance: "",
        ancPolice: "",
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
        <form onSubmit={handleSubmit}>
          <div className="grid gap-10">
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <p>Nom.</p>
                <Input
                  name=" Nom"
                  value={form.Nom}
                  onChange={(e) => handleChange("Nom", e.target.value)}
                  placeholder="Nom"
                  required={true}
                />
              </div>
              <div className="grid gap-2">
                <p>Prenom.</p>
                <Input
                  name=" Prenom"
                  value={form.Prenom}
                  onChange={(e) => handleChange("Prenom", e.target.value)}
                  placeholder="Prenom"
                  required
                />
              </div>
              <div className="grid gap-2">
                <p>NIF.</p>
                <Input
                  name="NIF"
                  value={form.NIF}
                  onChange={(e) => handleChange("NIF", e.target.value)}
                  placeholder="NIF"
                  required
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
                  required
                />
              </div>
              <div className="grid gap-2">
                <p>Adresse</p>
                <Input
                  name="Adresse"
                  value={form.Adresse}
                  onChange={(e) => handleChange("Adresse", e.target.value)}
                  placeholder="Adresse"
                  required
                />
              </div>
              <div className="grid gap-2 ">
                <p>Phone.</p>
                <Input
                  name="Phone"
                  value={form.Phone}
                  onChange={(e) => handleChange("Phone", e.target.value)}
                  placeholder="+509"
                  type="number"
                  required
                />
              </div>
              <div className="grid gap-2 ">
                <p>Email.</p>
                <Input
                  name="Email"
                  value={form.Email}
                  onChange={(e) => handleChange("Email", e.target.value)}
                  placeholder="YourEmail@gmail.com"
                  type="email"
                  required
                />
              </div>
            </div>{" "}
            <p className="text-center text-2xl font-bold underline">
              Donnees du vehicule.
            </p>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <p>Nom vehicule.</p>
                <Input
                  name="nomVehicule"
                  value={form.nomVehicule}
                  onChange={(e) => handleChange("nomVehicule", e.target.value)}
                  placeholder="Nom vehicule"
                  required={true}
                />
              </div>
              <div className="grid gap-2">
                <p>Marque.</p>
                <Input
                  name="Marque"
                  value={form.MarqueVehicule}
                  onChange={(e) =>
                    handleChange("MarqueVehicule", e.target.value)
                  }
                  placeholder="Marque"
                  required
                />
              </div>
              <div className="grid gap-2">
                <p>Moteur.</p>
                <Input
                  name="Moteur"
                  value={form.Moteur}
                  onChange={(e) => handleChange("Moteur", e.target.value)}
                  placeholder="Moteur"
                  required
                />
              </div>
              <div className="grid gap-2">
                <p>Serie.</p>
                <Input
                  name="Serie"
                  value={form.Serie}
                  onChange={(e) => handleChange("Serie", e.target.value)}
                  placeholder="Serie"
                  required
                />
              </div>
              <div className="grid gap-2">
                <p>type</p>
                <Input
                  name="Type"
                  value={form.Type}
                  onChange={(e) => handleChange("Type", e.target.value)}
                  placeholder="Type"
                  required
                />
              </div>
              <div className="grid gap-2 ">
                <p>Couleur.</p>
                <Input
                  name="Couleur"
                  value={form.Couleur}
                  onChange={(e) => handleChange("Couleur", e.target.value)}
                  placeholder="Couleur"
                  type="text"
                  required
                />
              </div>
              <div className="grid gap-2 ">
                <p>Plaque.</p>
                <Input
                  name="Plaque"
                  value={form.Plaque}
                  onChange={(e) => handleChange("Plaque", e.target.value)}
                  placeholder="TP-xxx"
                  required
                />
              </div>
              <div className="grid gap-2 ">
                <p>Annee.</p>
                <Input
                  name="Annee"
                  value={form.Annee}
                  onChange={(e) => handleChange("Annee", e.target.value)}
                  placeholder="2020"
                  type="number"
                  required
                />
              </div>
              <div className="grid gap-2 ">
                <p>Puissance.</p>
                <Input
                  name="Puissance"
                  value={form.Puissance}
                  onChange={(e) => handleChange("Puissance", e.target.value)}
                  placeholder="-"
                />
              </div>
              <div className="grid gap-2 ">
                <p>anc Police.</p>
                <Input
                  name="ancPolice"
                  value={form.ancPolice}
                  onChange={(e) => handleChange("ancPolice", e.target.value)}
                  placeholder="-"
                />
              </div>
            </div>{" "}
          </div>

          <div className="mt-6 text-center">
            <Button type="submit" className="px-6 py-2">
              Ajouter
            </Button>
          </div>
        </form>
      </div>
    </main>
  );
}
