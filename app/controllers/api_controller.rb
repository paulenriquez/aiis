class ApiController < ApplicationController
    def get_purchase_orders_for_customer_payment
        purchase_orders = PurchaseOrder.where(customer_account_id: params[:customer_account_id]).order(purchase_date: :asc)
        filtered_purchase_orders = []
        purchase_orders.each do |purchase_order|
            if purchase_order.outstanding_balance > 0
                purchase_order_to_hash = {
                    id: purchase_order.id,
                    po_num: purchase_order.po_num,
                    purchase_date: purchase_order.purchase_date,
                    negotiated_price: purchase_order.negotiated_price,
                    outstanding_balance: purchase_order.outstanding_balance
                }
                filtered_purchase_orders.push(purchase_order_to_hash)
            end
        end
        render json: filtered_purchase_orders
    end
end
