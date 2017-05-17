class PagesController < ApplicationController
    before_action :authenticate_user!
    require 'csv'

    def index
        @purchase_orders_due = PurchaseOrder.where(due_date: Date.today..(Date.today + 7.days)).order(due_date: :asc)
        
        @products_out_of_stock = []
        Product.all.each do |product|
            if product.remaining_quantity == 0
                @products_out_of_stock.push(product)
            end
        end
    end

    def backup
        render 'backup.html.erb'
    end
    def backup
        @customer_payments = CustomerPayment.all
        respond_to do |format|
            format.html
            format.csv {send_data @customer_payments.to_csv}
            format.xls {send_data @customer_payments.to_csv(col_sep: "\t")}
        end
    end
end
