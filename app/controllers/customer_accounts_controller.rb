class CustomerAccountsController < ApplicationController
    before_action :authenticate_user!
    def index
        @customer_accounts = CustomerAccount.all
    end
    def new
        @customer_account = CustomerAccount.new
    end
    def create
        @customer_account = CustomerAccount.new(customer_account_params)
        if @customer_account.save
            redirect_to customer_account_path(@customer_account)
            flash[:notice] = {type: 'success', header: 'Successfully created new Customer Account!', content: "The record for <b>#{@customer_account.customer_name}</b> was successfully created."}
        else
            render :new
        end
    end
    def show
        @customer_account = CustomerAccount.find(params[:id])
    end
    def edit
        @customer_account = CustomerAccount.find(params[:id])
    end
    def update
        @customer_account = CustomerAccount.find(params[:id])
        if @customer_account.update(customer_account_params)
            redirect_to(customer_account_path(@customer_account))
        else
            render :edit
        end
    end
    def delete

    end

    private
        def customer_account_params
            params.require(:customer_account).permit(
                :customer_name,
                :address,
                :email,
                :telephone_number,
                :fax_number)
        end
end
