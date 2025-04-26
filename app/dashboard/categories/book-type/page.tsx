"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { PlusCircle, Trash2, Search } from "lucide-react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface BookType {
  _id: string;
  title: string;
}

export default function BookTypesPage() {
  const [bookTypes, setBookTypes] = useState<BookType[]>([]);
  const [newBookType, setNewBookType] = useState({ title: "" });
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const user = sessionStorage.getItem("user");
  const token = user ? JSON.parse(user).token : null;

  useEffect(() => {
    fetchBookTypes();
  }, []);

  const fetchBookTypes = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("https://lkp.pathok.com.bd/api/bookType", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message);
      }
      
      setBookTypes(data.bookTypes);
    } catch (error:any) {
      toast.error(error.message);
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const addBookType = async () => {
    if (newBookType.title.trim() === "") {
      toast.warning("Book type title cannot be empty");
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch("https://lkp.pathok.com.bd/api/bookType", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newBookType),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message);
      }

      fetchBookTypes();
      toast.success("Book type added successfully");
      setNewBookType({ title: "" });
    } catch (error:any) {
      toast.error(error.message);
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const deleteBookType = async (id: string) => {
    setIsLoading(true);
    try {
      const response = await fetch(`https://lkp.pathok.com.bd/api/bookType/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message);
      }

      setBookTypes(bookTypes.filter((type) => type._id !== id));
      toast.success("Book type deleted successfully");
    } catch (error:any) {
      toast.error(error.message);
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredBookTypes =
    bookTypes && bookTypes.length > 0
      ? bookTypes.filter((type) => type.title.toLowerCase().includes(searchQuery.toLowerCase()))
      : [];

  return (
    <div className="space-y-6 p-6">
      <ToastContainer position="top-right" autoClose={3000} />

      <h1 className="text-3xl font-bold">Book Types</h1>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search book types..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      <div className="flex space-x-4">
        <Input
          placeholder="Book type title"
          value={newBookType.title}
          onChange={(e) => setNewBookType({ title: e.target.value })}
        />
        <Button onClick={addBookType} disabled={isLoading}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Add Type
        </Button>
      </div>

      {isLoading ? (
        <div className="text-center py-8">Loading book types...</div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {!bookTypes || filteredBookTypes.length === 0 ? (
              <TableRow>
                <TableCell colSpan={2} className="text-center py-8">
                  {searchQuery ? "No book types match your search" : "No book types found"}
                </TableCell>
              </TableRow>
            ) : (
              filteredBookTypes.map((type) => (
                <TableRow key={type._id}>
                  <TableCell className="font-medium">{type.title}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm" onClick={() => deleteBookType(type._id)} disabled={isLoading}>
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      )}
    </div>
  );
}