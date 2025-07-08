import { configureStore, Middleware } from "@reduxjs/toolkit";
import productSlice from './reducers/product';
import playlistSlice from './reducers/playlist';
import priceTableSlice from './reducers/priceTable';
import usersSlice from './reducers/user';
import templateSlice from './reducers/template';
import mediaSlice from './reducers/media';
import drawerSlice from './reducers/drawer';
import authSlice from './reducers/auth';
import { priceTableLayoutApi } from "../service/PriceTableLayoutService";
import { authApi } from "../service/AuthService";
import { priceTableApi } from "../service/PriceTableService";
import { templateApi } from "../service/TemplateService";
import { productApi } from "../service/ProductService";
import { mediaApi } from "../service/MediaService";
import { playlistApi } from "../service/PlaylistService";
import { deviceApi } from "../service/DeviceSessionService";
import { userApi } from "../service/UserService";
import {sysInfoApi} from "../service/SysInfoService";

const store = configureStore({
  reducer: {
    auth: authSlice,
    product: productSlice,
    playlist: playlistSlice,
    priceTable: priceTableSlice,
    users: usersSlice,
    template: templateSlice,
    media: mediaSlice,
    drawer: drawerSlice,
    [priceTableApi.reducerPath]: priceTableApi.reducer, 
    [authApi.reducerPath]: authApi.reducer,
    [productApi.reducerPath]: productApi.reducer,  
    [templateApi.reducerPath]: templateApi.reducer,
    [mediaApi.reducerPath]: mediaApi.reducer,
    [playlistApi.reducerPath]: playlistApi.reducer,
    [userApi.reducerPath]: userApi.reducer,
    [priceTableLayoutApi.reducerPath]: priceTableLayoutApi.reducer,
    [deviceApi.reducerPath]: deviceApi.reducer,
    [sysInfoApi.reducerPath]: sysInfoApi.reducer
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(
    priceTableLayoutApi.middleware,
    templateApi.middleware,
    authApi.middleware,
    userApi.middleware,
    priceTableApi.middleware,
    productApi.middleware,
    mediaApi.middleware,
    playlistApi.middleware,
    deviceApi.middleware,
    sysInfoApi.middleware
  ),
});
// Infer the type of `store`
export type AppStore = typeof store
// Infer the `AppDispatch` type from the store itself
export type AppDispatch = typeof store.dispatch
// Same for the `RootState` type
export type RootState = ReturnType<typeof store.getState>

export default store;