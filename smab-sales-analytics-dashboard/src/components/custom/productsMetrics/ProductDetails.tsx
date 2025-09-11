"use client"

import * as React from "react"
import { Package, QrCode, CreditCard, User, Building2, CheckCircle, XCircle, DollarSign } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DrawerClose,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { getProductDetails } from '@/services/productServices'
import { useCustomQuery } from '@/hooks/useCustomQuery'
import { formatDate, formatPrice } from '@/lib/utils'

interface ProductDetailsProps {
  barcode: string
  className?: string
}

export function ProductDetails({ barcode, className }: ProductDetailsProps) {

  if (typeof barcode !== "string") return <></>
  const { data, isLoading, error } = useCustomQuery(
    ['orders-products', barcode],
    async () => await getProductDetails(barcode)
  );

  console.log("{DATA}", data);

  return (
    <>
    {data ? (
            <div className="mx-auto w-full max-w-2xl">
              <DrawerHeader className="text-center">
                <DrawerTitle className="text-2xl font-bold">Product Analytics</DrawerTitle>
              </DrawerHeader>

              <div className="px-6 pb-6 space-y-6">
                {/* Order Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <Package className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium">Name</p>
                        <p className="text-sm text-muted-foreground">{data?.name}</p>
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
                      <CreditCard className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium">Total Sales</p>
                        <p className="text-sm text-muted-foreground">{data?.totalSales || "Unknown"}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <DollarSign className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium">Price TTC</p>
                        <p className="text-sm text-muted-foreground">{data?.price_ttc || "Unknown"}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <Separator />
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
              <p>No order data available</p>
            </div>
          )}
          </>
  )
}
