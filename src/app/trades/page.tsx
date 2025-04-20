"use client";
import React from "react";
import Link from "next/link";
import TradesView from "../../components/trades/TradesView";
import Card from "../../components/ui/Card";

export default function TradesPage() {
  return (
    <div className="max-w-5xl mx-auto py-12">
      <Card glow className="p-8">
        <h1 className="text-3xl font-bold mb-6">Trade History</h1>
        <p className="text-gray-600 dark:text-gray-300 mb-4">Review and manage all your trades here.</p>
        <Link href="/trades/new">
          <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 mb-6">
            Add New Trade
          </button>
        </Link>
        <div className="mt-8">
          <TradesView />
        </div>
      </Card>
    </div>
  );
}
