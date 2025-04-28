"use client";
import React, { useEffect, useRef, useState } from "react";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import Image from "next/image";
import logo from "@/public/motif_compagny.png";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/app/firebase/config";
//const logoBase64 = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUg...";
interface FormData {
  id: string; // Ajouté pour stocker l'ID du document
  Nom: string;
  Prenom: string;
  dateEtHeure: string;
  NIF: string;
  Adresse: string;
  Phone: string;
  Email: string;
  nomVehicule: string;
  MarqueVehicule: string;
  Moteur: string;
  Serie: string;
  Type: string;
  Couleur: string;
  Plaque: string;
  Annee: string;
  Puissance: string;
  ancPolice: string;
}
interface FormProps {
  id: string;
}
export default function PDFGenerator({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState<FormData | null>(null);
  const [loading2, setLoading2] = useState(true);
  const docKey = useRef("");

  const generatePDF = async () => {
    setLoading(true);

    const doc = new jsPDF();
    // 1. Charger le logo depuis /public/logo.png
    const response = await fetch("/motif_compagny.png");
    const blob = await response.blob();

    // 2. Convertir le Blob en Base64
    const logoBase64 = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(blob);
      reader.onloadend = () => {
        resolve(reader.result as string);
      };
      reader.onerror = reject;
    });
    // Logo (x, y, width, height)
    doc.addImage(logoBase64, "PNG", 15, 10, 30, 30);

    // Titre principal
    doc.setFontSize(18);
    doc.text("Etat des lieux du véhicule", 60, 20);
    // Titre principal
    doc.setFontSize(15);
    doc.text("LE:28/04/2025", 150, 20);
    // Sous-titre
    doc.setFontSize(9);
    doc.setTextColor(100);
    doc.text(
      `Ce document d'engagement est a signer obligatoirement
       à la prise du véhicule afin de le garantir en cas de
       chocs ou problème pendant le trajet.`,
      60,
      28
    );

    // Tableau avec autoTable
    autoTable(doc, {
      startY: 50,
      margin: { left: 10 },
      tableWidth: 80, // Réduit la largeur
      head: [["", "proprietaire"]],
      body: [
        ["NIF", "002-333-456-3"],
        ["Nom", "orcel "],
        ["Prenom", "Euler"],
        ["Adresse", "pv"],
        ["Phone", "47656226"],
        ["email", "Orceleu@gmail.com"],
      ],
      styles: { fontSize: 10 },
      headStyles: { fillColor: [52, 152, 219] },
    });

    autoTable(doc, {
      startY: 50,
      margin: { left: 110 },
      tableWidth: 80, // Réduit la largeur
      head: [["", "Véhicule"]],
      body: [
        ["Nom", "MITSHUBISHI"],
        ["Marque", "344"],
        ["Moteur", "345yuy "],
        ["Serie", "Pickup"],
        ["Type", "2400"],
        ["Couleur", "rouge"],
        ["Plaque", "tp-6488"],
        ["Annee", "2000"],
        ["Puissance", ""],
        ["Anc Police", "-"],
      ],
      styles: { fontSize: 10 },
      headStyles: { fillColor: [52, 152, 219] },
    });

    doc.setFontSize(15);
    doc.text("Partie Avant", 60, 140);
    autoTable(doc, {
      startY: 150,
      head: [["Etat", "Neuf", "Bon", "Correct", "Mauvais"]],
      theme: "grid",
      body: [
        ["Capot", "", "✅", "", ""],
        ["Optique D", "", "", "", ""],
        ["Optique G", "✅", "", "", ""],
        ["Pare-brise", "", "", "", ""],
        ["Pare-chocs", "", "", "", ""],
      ],
      styles: { fontSize: 10 },
      headStyles: { fillColor: [52, 152, 219] },
    });

    // Pied de page
    const pageHeight = doc.internal.pageSize.height;
    doc.setFontSize(10);
    doc.text("Page 1", doc.internal.pageSize.width - 20, pageHeight - 10);

    doc.save("rapport.pdf");
    setLoading(false);
  };
  useEffect(() => {
    const fetchForm = async () => {
      docKey.current = (await params).slug;
      try {
        const docRef = doc(db, "doc", docKey.current); // 'forms' est ta collection
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setForm({
            id: docSnap.id,
            ...(docSnap.data() as Omit<FormData, "id">),
          });
        } else {
          console.log("Aucun document trouvé");
        }
      } catch (error) {
        console.error("Erreur lors de la récupération du formulaire:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchForm();
  }, []);
  if (!form) {
    return <div className="p-4 text-red-500">Donnees introuvable.</div>;
  }
  return (
    <div className="p-4">
      <div className="flex justify-between">
        <Image src={logo} alt="logo" className="size-[50px]" />
        <button
          onClick={generatePDF}
          disabled={loading}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          {loading ? "Génération..." : "Télécharger le PDF"}
        </button>
      </div>
      <p className="text-center text-xl my-10 underline">Apercu du document</p>
      <div className="grid bg-slate-100 h-[1000px]">
        <div className="flex justify-center">
          <div className="flex justify-between max-w-[700px] p-10">
            <Image src={logo} alt="logo" className="size-[60px]" />
            <div>
              <p className="text-2xl font-bold text-center mb-5">
                Etat des lieux du véhicule.
              </p>
              <p className="text-gray-700 text-sm text-center">
                Ce document d'engagement est a signer obligatoirement à la prise
                du véhicule afin de le garantir en cas de chocs ou problème
              </p>
            </div>

            <p className="text-xl">
              <span className="text-gray-700">Le:</span>28/04/2025
            </p>
          </div>
        </div>
        <h2 className="text-2xl font-bold mb-4">Détails du formulaire</h2>
        <ul className="space-y-1">
          <li>
            <strong>Nom:</strong> {form.Nom}
          </li>
          <li>
            <strong>Prénom:</strong> {form.Prenom}
          </li>
          <li>
            <strong>Date et Heure:</strong> {form.dateEtHeure}
          </li>
          <li>
            <strong>NIF:</strong> {form.NIF}
          </li>
          <li>
            <strong>Adresse:</strong> {form.Adresse}
          </li>
          <li>
            <strong>Téléphone:</strong> {form.Phone}
          </li>
          <li>
            <strong>Email:</strong> {form.Email}
          </li>
          <li>
            <strong>Nom Véhicule:</strong> {form.nomVehicule}
          </li>
          <li>
            <strong>Marque Véhicule:</strong> {form.MarqueVehicule}
          </li>
          <li>
            <strong>Moteur:</strong> {form.Moteur}
          </li>
          <li>
            <strong>Série:</strong> {form.Serie}
          </li>
          <li>
            <strong>Type:</strong> {form.Type}
          </li>
          <li>
            <strong>Couleur:</strong> {form.Couleur}
          </li>
          <li>
            <strong>Plaque:</strong> {form.Plaque}
          </li>
          <li>
            <strong>Année:</strong> {form.Annee}
          </li>
          <li>
            <strong>Puissance:</strong> {form.Puissance}
          </li>
          <li>
            <strong>Ancienne Police:</strong> {form.ancPolice}
          </li>
        </ul>
      </div>
    </div>
  );
}
