"use client"

import type * as React from "react"
import { Package, Calendar, CreditCard, User, Building2, CheckCircle, XCircle } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { formatDate, formatPrice } from '@/lib/utils'
interface Product {
  _id: { $oid: string }
  name: string
  quantity: number
  barcode: string
  warehouse: string
}

interface Order {
  _id: { $oid: string }
  orderNumber: string
  orderDate: { $date: string }
  paymentMethod: string | null
  products: Product[]
  updatedAt: { $date: string }
  salesAgent: string | null
  customerName: string
  prixttc: number | null
  isConfirmed: boolean
  __v: number
}

interface OrderDetailsDrawerProps {
  order: Order
  trigger?: React.ReactNode
}

export function OrderDetailsDrawer({ order, trigger }: OrderDetailsDrawerProps) {


  return (
    <Drawer>
      <DrawerTrigger asChild>{trigger || <Button variant="outline">View Order Details</Button>}</DrawerTrigger>
      <DrawerContent>
        <div className="mx-auto w-full max-w-2xl overflow-y-auto">
          <DrawerHeader className="text-center">
            <DrawerTitle className="text-2xl font-bold">Order #{order.orderNumber}</DrawerTitle>
            <DrawerDescription className="flex items-center justify-center gap-2 mt-2">
              <Badge variant={order.isConfirmed ? "default" : "secondary"} className="flex items-center gap-1">
                {order.isConfirmed ? <CheckCircle className="h-3 w-3" /> : <XCircle className="h-3 w-3" />}
                {order.isConfirmed ? "Confirmed" : "Pending"}
              </Badge>
            </DrawerDescription>
          </DrawerHeader>

          <div className="px-6 pb-6 space-y-6">
            {/* Order Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Calendar className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Order Date</p>
                    <p className="text-sm text-muted-foreground">{formatDate(order.orderDate)}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Building2 className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Customer</p>
                    <p className="text-sm text-muted-foreground">{order.customerName || "Unknown"}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <User className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Sales Agent</p>
                    <p className="text-sm text-muted-foreground">{order.salesAgent || "Unknown"}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <CreditCard className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Payment Method</p>
                    <p className="text-sm text-muted-foreground">{order.paymentMethod || "Unknown"}</p>
                  </div>
                </div>
              </div>
            </div>

            <Separator />

            {/* Products Section */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                <h3 className="text-lg font-semibold">Products ({order?.products?.length})</h3>
              </div>

              <div className="space-y-3 max-h-64 overflow-y-auto">
                {order?.products?.map((product, index) => (
                  <div key={product?._id} className="border rounded-lg p-4 space-y-2">
                    <div className="flex justify-between items-start">
                      <h4 className="font-medium text-sm leading-tight pr-2">{product.name}</h4>
                      <Badge variant="outline" className="shrink-0">
                        Qty: {product.quantity}
                      </Badge>
                    </div>

                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>Barcode: {product.barcode}</span>
                      <span>Warehouse: {product.warehouse}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <Separator />

            {/* Order Summary */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="font-medium">Total Price:</span>
                <span className="text-lg font-bold">{formatPrice(order.prixttc)} <span className='text-xs'>MAD</span></span>
              </div>

              <div className="flex justify-between items-center text-sm text-muted-foreground">
                <span>Last Updated:</span>
                <span>{formatDate(order.updatedAt)}</span>
              </div>
            </div>
          </div>

          <div className="px-6 pb-6">
            <DrawerClose asChild>
              <Button variant="outline" className="w-full bg-transparent">
                Close
              </Button>
            </DrawerClose>
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  )
}
