export default {
  data: '',
  PlatformInfo: '',
  SelectedCatoryId: '',
  ProductCategoriesData: '',
  ProductData: '',
  FavIconUncheck: 'heart-o',
  FavIconCheck: 'heart',
  IconName: '',
  Categories: [],
  CategoryName: [],
  Product_PrentId: '',
  NetworkInfo: false,
  DeviceId: '',
  LanguageCode: '',
  SearchProduct: '',
  SearchSourceNavKey: '',
  favouriteProducts: [],
  Language: '',
  IfNoneMatch: '',
  ResponseStatus: '',
  DefaultCountryCode: '+91',
  SearchText: [],
  FlatListIndex: 0,
  SearchFlatListIndex: 0,
  EventFlatListIndex: 0,
  TabIconColor: '',
  SearchKey: '',
  EnabledEvents: [],
  TxtFontSize: '',
  TxtTittleFontSize: '',
  CurrencyRate: 0,
  CurrencyPrefix: '',
  CurrencySuffix: '',
  CurrencyDelimeter: '',
  DeepLinkNavToken: true,
  StarUncheck: 'star-o',
  StarCheck: 'star',
  StarredEvents: [],
  StarIcon: '',
  EventKey: '',
  HtmlForm: `<!doctype html>
  <html>
  <head>
  </head>
  <body onload="document.forms['postcart'].submit()">
    <form id="postcart" name="postcart" action="%basepath%" method="POST" >
        <input type="hidden" value="cart" name="target" />
        <input type="hidden" value="add" name="action" />
        <input type="hidden" value="search" name="mode" />
        <input type="hidden" value="%prodId%" name="product_id" />
        <input type="hidden" value="%amount%" name="amount" />
        <input type="hidden" value="https://www.anjayneya.in/skins/customer/modules/Qualiteam/IFarmerFPOProfile/social_icons/Android.png" name="returnURL" />      
        <input type="submit" />
    </form>
  </body>
  </html>`,
  VariantsHtmlForm: `<!doctype html>
             <html>
             <head>
             </head>
             <body onload="document.forms['postcart'].submit()">
               <form id="postcart" name="postcart" action="%basepath%" method="POST" >
                   <input type="hidden" value="cart" name="target" />
                   <input type="hidden" value="add" name="action" />
                   <input type="hidden" value="search" name="mode" />
                   <input type="hidden" value="%prodId%" name="product_id" />
                   <input type="hidden" value="%amount%" name="amount" />
                   %attributeValues%
                   <input type="hidden" value="https://www.anjayneya.in/skins/customer/modules/Qualiteam/IFarmerFPOProfile/social_icons/Android.png" name="returnURL" />      
                   <input type="submit" />
               </form>
             </body>
             </html>`,
  BadgeCount: 0,
  LangForm: `<!doctype html>
            <html>
            <head>
            </head>
            <body onload="document.forms['changeLang'].submit()">
              <form id="changeLang" name="changeLang" action="https://nambusiness.live/?" method="POST" >
                  <input type="hidden" value="change_currency" name="target" />
                  <input type="hidden" value="update" name="action" />
                  <input type="hidden" value="fr" name="language" />
                  <input type="hidden" value="IN" name="country_code" />
                  <input type="hidden" value="INR" name="currency_code" />
                  <input type="hidden" value="https://nambusiness.live/nambusiness/combo.html?appview=1" name="returnURL" />      
                  <input type="submit" />
              </form>
            </body>
            </html>`,
  Test: '',
  sourcePage: '',
  textSearch: '',
  LoginToken: '',
  StoreData: '',
  Latitude: '',
  Longitude: '',
  CartProducts: [],
  ServicesState: true,
  ChangeLocation: false,
  CartCount: [],
  UserName: '',
  UserPhone: '',
  LocationAddress: '',
  EmptyEvent: [
    {
      "id": 197,
      "name": "No new events",
      "date": "15/06/2020",
      "timestamp": "10:52:38",
      "content": "<p> </p>",
      "brief": "",
      "enabled": true,
      "clean_url": "https://tmc.cbe.nam.app/testing-8.html",
      "meta-title": "",
      "meta-tags": "",
      "meta-desc": "",
      "categories": []
    }
  ],
  ChildCategories: false,
  Utag: '',
  Logoff: '',
  ViewCart: ''
}