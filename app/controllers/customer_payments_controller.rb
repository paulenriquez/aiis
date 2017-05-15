class CustomerPaymentsController < ApplicationController
    before_action :get_records, only: [:index, :new, :edit]

    def index
        @customer_payments = CustomerPayment.all
    end

    def new
        # Customer Account ID & Purchase Order
        if params[:customer_account_id] != nil && params[:customer_account_id] != '' && params[:purchase_order_id] != nil && params[:purchase_order_id] != ''
            @new_form_prefilled_data = {customer_account_id: params[:customer_account_id], purchase_order_id: params[:purchase_order_id]}
            @customer_payment = CustomerPayment.new(customer_account_id: @new_form_prefilled_data[:customer_account_id], purchase_order_id: @new_form_prefilled_data[:purchase_order_id])
        
        # Customer Account ID only
        elsif params[:customer_account_id] != nil && params[:customer_account_id] != ''
            @new_form_prefilled_data = {customer_account_id: params[:customer_account_id]}
            @customer_payment = CustomerPayment.new(customer_account_id: @new_form_prefilled_data[:customer_account_id])
        
        # Blank Form
        else
            @customer_payment = CustomerPayment.new
        end
    end

    def create
        @customer_payment = CustomerPayment.new(customer_payment_params)
        if @customer_payment.save
            redirect_to customer_payment_path(@customer_payment), notice: 'Payment successfully recorded.'
             flash[:notice] = {type: 'success', header: 'Successfully created new Customer Payment!', content: "The payment record by <b>#{@customer_payment.customer_account.customer_name}</b> for <b>#{@customer_payment.purchase_order.po_num}</b> was successfully created."}
        else
            render :new
        end
    end

    def show
        @customer_payment = CustomerPayment.find(params[:id])
        @customer_account = CustomerAccount.find(@customer_payment.customer_account_id)
    end

    private
        def get_records
            @customer_accounts = CustomerAccount.all
            @products = Product.all
            @purchase_orders = PurchaseOrder.all
        end
        def customer_payment_params
            params.require(:customer_payment).permit!
        end
end
