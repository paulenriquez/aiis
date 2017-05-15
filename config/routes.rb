Rails.application.routes.draw do
  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html

  resources :api, only:[] do
    collection do
        get '/po_for_payment', to: 'api#get_purchase_orders_for_customer_payment'
    end
  end

  resources :customer_accounts, path: 'customers'
  resources :purchase_orders, path: 'orders' do
    get '/edit/status', to: 'purchase_orders#edit_status'
  end
  scope '/inventory' do
    resources :products, path: 'products'
    resources :inventory_histories, path: 'updates'
  end
  resources :customer_payments, path: 'payments'
end