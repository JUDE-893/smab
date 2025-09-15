"use client"

import * as React from "react"
import { Package, QrCode, DollarSign, User } from "lucide-react";
import { IconShoppingCartBolt
} from "@tabler/icons-react"
import { Button } from "@/components/ui/button"
import {
  DrawerClose,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer"
import { Separator } from "@/components/ui/separator"
import { getCustomerAnalysis } from '@/services/customersServices'
import { useCustomQuery } from '@/hooks/useCustomQuery'
import { PurchaseActivityChart } from './PurchaseActivityChart'
import { CustomerOrdersHeatMapChart } from './CustomerOrdersHeatMapChart'
import { formatPrice } from "@/lib/utils";

interface ProductDetailsProps {
  barcode: string
  className?: string
}

export function CustomerDetails({ customerName, className }: ProductDetailsProps) {

  if (typeof customerName !== "string") return <></>
  const { data, isLoading, error } = useCustomQuery(
    ['customer', customerName],
    async () => await getCustomerAnalysis(customerName)
  );

  console.log("{DATA}", data);

  return (
    <>
    {data ? (
            <div className="mx-auto w-full max-w-2xl scroll-auto">
              <DrawerHeader className="text-center">
                <DrawerTitle className="text-2xl font-bold">About Customer</DrawerTitle>
              </DrawerHeader>

              <div className="px-6 pb-6 space-y-6 md:ml-36 mt-8">
                {/* Product Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <User className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium">Name</p>
                        <p className="text-sm text-muted-foreground">{data?.customer_name}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <QrCode className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium">Barcode</p>
                        <p className="text-sm text-muted-foreground">{data?.barcode || "Unknown"}</p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <DollarSign className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium">Total Sales</p>
                        <p className="text-sm text-muted-foreground">{formatPrice(data?.totalRevenue) || "Unknown"}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <Package className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium">Total Orders</p>
                        <p className="text-sm text-muted-foreground">{data?.totalOrders}</p>
                      </div>
                    </div>
                  </div>
                </div>

              </div>
              <div className="px-6 pb-6 space-y-6 mt-8">
                <Separator />
              </div>

              {/* Product activity */}
              <div className="space-y-4 mt-6">
                <div className="flex items-center gap-2 text-primary">
                  <Package className="h-5 w-5" />
                  <h3 className="text-lg font-semibold">Purchase Activity</h3>
                </div>
                <PurchaseActivityChart data={data?.monthlyAnalysis} isLoading={isLoading} error={error} />
              </div>

              {/* FMCG Rate */}
              <div className="space-y-4 my-11">
                <div className="flex items-center gap-2 text-primary">
                  <IconShoppingCartBolt className="h-5 w-5" />
                  <h3 className="text-lg font-semibold">Customer purchase Analysis</h3>
                </div>
                <CustomerOrdersHeatMapChart data={data?.dailyOrders} isLoading={isLoading} error={error} />
              </div>

              <div className="px-6 pb-6">
                <DrawerClose asChild>
                  <Button
                    variant="outline"
                    className="w-full bg-transparent"
                    onClick={() => setIsOpen(false)}
                  >
                    Close
                  </Button>
                </DrawerClose>
              </div>
            </div>
          ) : (
            // Optional: Add a loading state or empty state
            <div className="mx-auto w-full max-w-2xl p-6 text-center">
              <p>No user data available</p>
            </div>
          )}
          </>
  )
}
