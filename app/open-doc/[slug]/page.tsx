"use client";
import React, { useEffect, useRef, useState } from "react";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import Image from "next/image";
import logo from "@/public/motif_compagny.png";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/app/firebase/config";
import { Button } from "@/components/ui/button";
import { ArrowBigLeft } from "lucide-react";
import { useRouter } from "next/navigation";
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
  const router = useRouter();
  const clientData: Record<string, string> = {
    Nom: form?.Nom ?? "",
    Prénom: form?.Prenom ?? "",
    DateEtHeure: form?.dateEtHeure ?? "",
    NIF: form?.NIF ?? "",
    Adresse: form?.Adresse ?? "",
    Téléphone: form?.Phone ?? "",
    Email: form?.Email ?? "",
  };
  const vehiculeData: Record<string, string> = {
    NomVéhicule: form?.nomVehicule ?? "",
    MarqueVéhicule: form?.MarqueVehicule ?? "",
    Moteur: form?.Moteur ?? "",
    Série: form?.Serie ?? "",
    Type: form?.Type ?? "",
    Couleur: form?.Couleur ?? "",
    Plaque: form?.Plaque ?? "",
    Année: form?.Annee ?? "",
    Puissance: form?.Puissance ?? "",
    ancPolice: form?.ancPolice ?? "",
  };

  const renderTable = (title: string, data: Record<string, string>) => (
    <div className="w-full md:w-1/2 p-2">
      <table className="w-full border border-gray-300">
        <thead>
          <tr className="bg-blue-500 text-white">
            <th className="text-left p-2" colSpan={2}>
              {title}
            </th>
          </tr>
        </thead>
        <tbody>
          {Object.entries(data).map(([key, value]) => (
            <tr key={key} className="border-t border-gray-300">
              <td className="p-2 font-semibold">{key}</td>
              <td className="p-2">{value}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

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
    doc.text(`${form?.dateEtHeure}`, 150, 20);
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
      head: [["", "propriétaire"]],
      body: [
        ["Nom", `${form?.Nom}`],
        ["Prenom", `${form?.Prenom}`],
        ["DateEtHEure", `${form?.dateEtHeure}`],
        ["NIF", "002-333-456-3"],
        ["Adresse", `${form?.Adresse}`],
        ["Phone", `${form?.Phone}`],
        ["email", `${form?.Email}`],
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
        ["Nom", `${form?.nomVehicule}`],
        ["Marque", `${form?.MarqueVehicule}`],
        ["Moteur", `${form?.Moteur}`],
        ["Serie", `${form?.Serie}`],
        ["Type", `${form?.Type}`],
        ["Couleur", `${form?.Couleur}`],
        ["Plaque", `${form?.Plaque}`],
        ["Annee", `${form?.Annee}`],
        ["Puissance", `${form?.Puissance}`],
        ["Anc Police", `${form?.ancPolice}`],
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
    <div className="p-4 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <Image src={logo} alt="logo" className="w-12 h-12" />
        <button
          onClick={generatePDF}
          disabled={loading}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? "Génération..." : "Télécharger le PDF"}
        </button>
      </div>
      <Button
        variant="outline"
        onClick={() => {
          router.back();
        }}
      >
        <ArrowBigLeft />
      </Button>

      {/* Titre aperçu */}
      <p className="text-center text-xl my-8 underline">Aperçu du document</p>

      {/* Bandeau principal */}
      <div className="w-full bg-slate-100 py-6 px-4">
        <div className="flex flex-wrap justify-between items-center gap-6 max-w-6xl mx-auto">
          {/* Logo */}
          <Image src={logo} alt="logo" className="w-16 h-16 object-contain" />

          {/* Texte central */}
          <div className="flex-1 text-center">
            <p className="text-2xl font-bold mb-2">
              État des lieux du véhicule
            </p>
            <p className="text-sm text-gray-700 max-w-md mx-auto">
              Ce document d'engagement est à signer obligatoirement à la prise
              du véhicule afin de le garantir en cas de chocs ou problème.
            </p>
          </div>

          {/* Date */}
          <div className="text-right text-sm text-gray-800">
            <p className="text-base font-medium">Le :</p>
            <p className="text-base">{form.dateEtHeure}</p>
          </div>
        </div>
      </div>

      {/* Tables */}
      <div className="py-8 bg-gray-50">
        <div className="flex flex-col md:flex-row gap-6 justify-center max-w-6xl mx-auto">
          {renderTable("Propriétaire", clientData)}
          {renderTable("Véhicule", vehiculeData)}
        </div>
      </div>
    </div>
  );
}
