class CustomerAccountsController < ApplicationController
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
