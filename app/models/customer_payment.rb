class CustomerPayment < ApplicationRecord
    belongs_to :customer_account
    belongs_to :purchase_order
end
