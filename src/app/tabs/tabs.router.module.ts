import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { TabsPage } from './tabs.page';
import { HomePage } from './../home/home.page';
import { CartPage } from './../cart/cart.page';
import { CategoriesPage } from './../categories/categories.page';
import { SearchPage } from './../search/search.page';
import { ProductsPage } from './../products/products.page';
import { ProductPage } from './../product/product.page';
import { ReviewPage } from './../review/review.page';
import { PostPage } from './../post/post.page';
//import { ContactPage } from './../contact/contact.page';
import { AccountPage } from './../account/account.page';
import { CheckoutAddressPage } from './../checkout/address/address.page';
import { CheckoutPage } from './../checkout/checkout/checkout.page';
import { OrderSummaryPage } from './../checkout/order-summary/order-summary.page';

import { AddressPage } from './../account/address/address.page';
import { BlogPage } from './../account/blog/blog.page';
import { BlogsPage } from './../account/blogs/blogs.page';
import { EditAddressPage } from './../account/edit-address/edit-address.page';
import { ForgottenPage } from './../account/forgotten/forgotten.page';
import { LoginPage } from './../account/login/login.page';
import { MapPage } from './../account/map/map.page';
import { OrderPage } from './../account/order/order.page';
import { OrdersPage } from './../account/orders/orders.page';
import { PointsPage } from './../account/points/points.page';
import { RegisterPage } from './../account/register/register.page';
import { SettingPage } from './../account/setting/setting.page';
import { CurrenciesPage } from './../account/currencies/currencies.page';
import { WalletPage } from './../account/wallet/wallet.page';
import { WishlistPage } from './../account/wishlist/wishlist.page';


const routes: Routes = [
  {
    path: 'tabs',
    component: TabsPage,
    children: [
      {
        path: 'home',
        children: [
          {
            path: '',
            component: HomePage,
          },
          {
            path: 'products/:id',
            children: [
              {
                path: '',
                component: ProductsPage
              },
              {
                path: 'product/:id',
                children: [
                  {
                    path: '',
                    component: ProductPage
                  },
                  {
                    path: 'review/:id',
                    component: ReviewPage
                  }
                ]
              }
            ]
          },
          {
            path: 'product/:id',
            children: [
              {
                path: '',
                component: ProductPage
              },
              {
                path: 'review/:id',
                component: ReviewPage
              }
            ]
          },
          {
            path: 'vendor-products',
            children: [
              {
                path: '',
                component: ProductsPage
              },
              {
                path: 'product/:id',
                children: [
                  {
                    path: '',
                    component: ProductPage
                  },
                  {
                    path: 'review/:id',
                    component: ReviewPage
                  }
                ]
              }
            ]
          },
          {
            path: 'post/:id',
            component: PostPage
          }
        ]
      },
     /* {
        path: 'categories',
        children: [
          {
            path: '',
            component: CategoriesPage
          },
          {
            path: 'products/:id',
            children: [
              {
                path: '',
                component: ProductsPage
              },
              {
                path: 'product/:id',
                children: [
                  {
                    path: '',
                    component: ProductPage
                  },
                  {
                    path: 'review/:id',
                    component: ReviewPage
                  }
                ]
              }
            ]
          },
          {
            path: 'vendor-products',
            children: [
              {
                path: '',
                component: ProductsPage
              },
              {
                path: 'product/:id',
                children: [
                  {
                    path: '',
                    component: ProductPage
                  },
                  {
                    path: 'review/:id',
                    component: ReviewPage
                  }
                ]
              }
            ]
          }
        ]
      }, */
      {
        path: 'search',
        children: [
          {
            path: '',
            component: SearchPage
          },
          {
            path: 'product/:id',
            children: [
              {
                path: '',
                component: ProductPage
              },
              {
                path: 'review/:id',
                component: ReviewPage
              }
            ]
          },
          {
            path: 'vendor-products',
            children: [
              {
                path: '',
                component: ProductsPage
              },
              {
                path: 'product/:id',
                children: [
                  {
                    path: '',
                    component: ProductsPage
                  },
                  {
                    path: 'review/:id',
                    component: ReviewPage
                  }
                ]
              }
            ]
          }
        ]
      },
      {
        path: 'cart',
        children: [
          {
            path: '',
            component: CartPage
          },
          {
            path: 'address',
            component: CheckoutAddressPage
          },
          {
            path: 'checkout',
            component: CheckoutPage
          },
          {
            path: 'product/:id',
            children: [
              {
                path: '',
                component: ProductPage
              },
              {
                path: 'review/:id',
                component: ReviewPage
              }
            ]
          }
        ]
      },
  
      
      {
        path: 'account',
        children: [
          {
            path: '',
            component: AccountPage
          },
          {
            path: 'address',
            children: [
              {
                path: '',
                component: AddressPage
              },
              {
                path: 'edit-address',
                component:EditAddressPage
              }
            ]
          },
          {
          path: 'register',
            component: RegisterPage
          },
          {
          path: 'points',
            component: PointsPage
          },
          {
            path: 'setting',
            component: SettingPage
          },
          {
            path: 'currencies',
            component: CurrenciesPage
          },
          {
            path: 'wallet',
            children: [
              {
                path: '',
                component: WalletPage
              },
              {
                path: 'cart',
                component: CartPage
              }
            ]
          },
          {
            path: 'post/:id',
            component: PostPage
          },
          {
            path: 'map',
            component: MapPage
          },
          {
            path: 'orders',
            children: [
              {
                path: '',
                component: OrdersPage
              },
              {
                path: 'order/:id',
                component: OrderPage
              }
            ]
          },
          {
            path: 'login',
            children: [
              {
                path: '',
                component: LoginPage
              },
              {
                path: 'forgotten',
                component: ForgottenPage
              }
            ]
          },
          {
            path: 'wishlist',
            children: [
              {
                path: '',
                component: WishlistPage
              },
              {
                path: 'product/:id',
                children: [
                  {
                    path: '',
                    component: ProductPage
                  },
                  {
                    path: 'review/:id',
                    component: ReviewPage
                  }
                ]
              }
            ]
          },
          {
            path: 'blogs',
            children: [
              {
                path: '',
                component: BlogsPage
              },
              {
                path: 'blog/:id',
                component: BlogPage
              }
            ]
          },
        ]
      },
      {
        path: '',
        redirectTo: '/tabs/home',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: '',
    redirectTo: '/tabs/home',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TabsPageRoutingModule {}
