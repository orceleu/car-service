"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { onAuthStateChanged, User } from "firebase/auth";
import { collection, getDocs } from "firebase/firestore";
import { CheckCircle, PlusIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { auth, db } from "../firebase/config";

interface Documents {
  NomClient: string;
  dateEtHeure: string;
}
type DocumentsWithId = Documents & { id: string };
export default function Dashboard() {
  const [user, setUser] = useState<User | null>(null);
  const [doc, setDoc] = useState<DocumentsWithId[]>([]);
  const router = useRouter();

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
  return (
    <div>
      <div className="flex justify-between p-3 md:p-5 bg-slate-200 w-full fixed top-0">
        <p className="text-center text-xl font-bold ">welcome.</p>
        <div className="flex items-center gap-2">
          <p>Admin? </p> <CheckCircle />
          <Button>
            <PlusIcon /> Add user
          </Button>
        </div>
      </div>
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <div className="flex justify-center w-full">
        <div className="mt-10 gap-10 w-full">
          {" "}
          <Button
            className="mx-4 my-5"
            onClick={() => {
              router.push("/dashboard/create-doc");
            }}
          >
            {" "}
            create document
          </Button>
          <Input placeholder="search by name" className="mx-4 my-5" />
          <ul className="space-y-4 mx-4">
            {doc.map((data, i) => (
              <li
                key={i}
                className="flex justify-between items-center p-4 border rounded shadow"
                onClick={() => {
                  alert(data.id);
                  router.push("/open-doc");
                }}
              >
                <div key={i + 1}>
                  <p className="font-semibold" key={i + 2}>
                    {data.NomClient}
                  </p>
                  <p className="text-sm text-gray-600" key={i + 4}>
                    Date: {data.dateEtHeure}
                  </p>
                </div>
                <button
                  className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
                  key={i + 3}
                >
                  Supprimer
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
