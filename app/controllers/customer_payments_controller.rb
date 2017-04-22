class CustomerPaymentsController < ApplicationController
    def index
        @customer_payments = CustomerPayment.all
    end

    def new
        @customer_payment = CustomerPayment.new
    end

    def create
        @customer_payment = CustomerPayment.new(customer_payment_params)
        if @customer_payment.save
            redirect_to customer_payment_path(@customer_payment)
        else
            render :new
        end
    end

    def show
        @customer_payment = CustomerPayment.find(params[:id])
        @customer_account = CustomerAccount.find(@customer_payment.customer_account_id)
    end

    private
        def customer_payment_params
            params.require(:customer_payment).permit(
                :payment_date,
                :amount_paid,
                :customer_account_id,
                :purchase_order_id)
        end
end
