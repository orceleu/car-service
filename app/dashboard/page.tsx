"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { onAuthStateChanged, signOut, User } from "firebase/auth";
import { collection, deleteDoc, doc, getDocs } from "firebase/firestore";
import { CheckCircle, LogOut, PlusIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { auth, db } from "../firebase/config";
import Image from "next/image";
import logo from "@/public/motif_compagny.png";
interface Documents {
  Nom: string;
  Prenom: string;
  dateEtHeure: string;
}
type DocumentsWithId = Documents & { id: string };
export default function Dashboard() {
  const [user, setUser] = useState<User | null>(null);
  const [doc1, setDoc] = useState<DocumentsWithId[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();

  const filteredData = doc1.filter((data) =>
    data.Nom.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const deleteDocument = async (collectionName: string, docId: string) => {
    try {
      const docRef = doc(db, collectionName, docId);
      await deleteDoc(docRef);
      alert(`Document ${docId} supprimé avec succès`);
      setDoc((prev) => prev.filter((doc) => doc.id !== docId));
    } catch (error) {
      console.error("Erreur lors de la suppression du document :", error);
      throw error;
    }
  };
  /* const getCustomerdata = async (email: string) => {
        const docRef = doc(db, "users", email); // replace with customerID
        const docSnap = await getDoc(docRef);
        if (docSnap) {
          setLoading(false);
        }
        if (docSnap.exists()) {
          if (docSnap.data().ispro) {
            listSchematicsPro(docSnap.data().ispro);
            setUserPro("pro");
            setCredits(docSnap.data().credits);
    
            console.log(`user is Pro?:${docSnap.data().ispro}`);
            console.log(`user is Pro?:${isUserPro}`);
          } else {
            setUserPro("free");
    
            console.log(`user is Pro?:${isUserPro}`);
          }
        } else {
          setUserPro("free");
    
          console.log(`user is Pro?:${isUserPro}`);
        }
      };
    */ const getCustomerdata = async () => {
    const querySnapshot = await getDocs(collection(db, "doc"));

    const docss: DocumentsWithId[] = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as (Documents & { id: string })[];
    setDoc(docss);
    console.log(docss);
  };
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);

      if (user !== null && user !== undefined) {
        if (user.email !== null) {
          getCustomerdata();
        }

        //userId.current = user.uid;
        //userEmail.current = user.email;
      } /*else {
            router.replace("/auth"); bug aller retour entre auth et user/auth
          }*/
    });
    return () => unsubscribe();
  }, [user]);
  const logOut = async () => {
    await signOut(auth);
    if (user == null) {
      router.replace("/");
    }
  };
  return (
    <>
      <div className="flex justify-between p-3 md:p-5 bg-slate-200 w-full fixed top-0">
        <Image src={logo} alt="logo" className="size-[60px]" />
        <div className="flex items-center gap-2">
          <p>Admin? </p> <CheckCircle />
          <Button variant="outline">
            <PlusIcon /> Add user
          </Button>
          <Button variant="outline" onClick={logOut}>
            <LogOut />
          </Button>
        </div>
      </div>
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <div className="flex justify-center w-full p-4">
        <div className="mt-10 gap-10 w-full">
          {" "}
          <Button
            className=" my-5"
            variant="outline"
            onClick={() => {
              router.push("/dashboard/create-doc");
            }}
          >
            <PlusIcon />
            create document
          </Button>
          <div className="flex justify-center">
            <Input
              className="max-w-[500px] my-[50px] "
              placeholder="search by name or category"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <ul className="space-y-4 ">
            {filteredData.map((data, i) => (
              <div className="flex justify-between gap-3" key={i + 9}>
                <div
                  key={i}
                  className="flex w-full items-center p-4 border rounded shadow hover:bg-gray-100"
                  onClick={() => {
                    router.push(`/open-doc/${data.id}/`);
                  }}
                >
                  <div key={i + 1}>
                    <p className="font-semibold" key={i + 2}>
                      <span> {data.Nom}</span> <span>{data.Prenom}</span>
                    </p>
                    <p className="text-sm text-gray-600" key={i + 4}>
                      Date: {data.dateEtHeure}
                    </p>
                  </div>
                </div>{" "}
                <Button
                  className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
                  key={i + 3}
                  onClick={() => {
                    deleteDocument("doc", data.id);
                  }}
                >
                  Supprimer
                </Button>
              </div>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
}
