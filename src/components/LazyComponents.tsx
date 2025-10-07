import React, { Suspense, lazy } from 'react';
import LoadingSpinner from './LoadingSpinner';

// Lazy load heavy components
export const LazyClientForm = React.lazy(() =>
  import('./ClientForm').then(module => ({ default: module.ClientForm }))
);

export const LazyPropertyManager = React.lazy(() => 
  import('./PropertyManager').then(module => ({ default: module.PropertyManager }))
);

export const LazyQuickAddPropertyForm = React.lazy(() => 
  import('./QuickAddPropertyForm').then(module => ({ default: module.QuickAddPropertyForm }))
);

export const LazyBuyerPreferencesForm = React.lazy(() => 
  import('./forms/BuyerPreferencesForm').then(module => ({ default: module.BuyerPreferencesForm }))
);

export const ClientDataForm = lazy(() => import('./forms/ClientDataForm').then(module => ({ default: module.ClientDataForm })));
export const CompletedOperationForm = lazy(() => import('./forms/CompletedOperationForm').then(module => ({ default: module.CompletedOperationForm })));

// Lazy load heavy UI components
export const EditingPropertyManager = lazy(() => import('./EditingPropertyManager').then(module => ({ default: module.EditingPropertyManager })));

// Wrapper components with Suspense
export const ClientForm = (props: any) => (
  <Suspense fallback={<LoadingSpinner />}>
    <LazyClientForm {...props} />
  </Suspense>
);

export const PropertyManager = (props: any) => (
  <Suspense fallback={<LoadingSpinner />}>
    <LazyPropertyManager {...props} />
  </Suspense>
);

export const QuickAddPropertyForm = (props: any) => (
  <Suspense fallback={<LoadingSpinner />}>
    <LazyQuickAddPropertyForm {...props} />
  </Suspense>
);

export const BuyerPreferencesForm = (props: any) => (
  <Suspense fallback={<LoadingSpinner />}>
    <LazyBuyerPreferencesForm {...props} />
  </Suspense>
);

// Lazy load chart components
export const ChartContainer = lazy(() => import('./ui/chart').then(module => ({ default: module.ChartContainer })));
export const ChartTooltip = lazy(() => import('./ui/chart').then(module => ({ default: module.ChartTooltip })));
export const ChartTooltipContent = lazy(() => import('./ui/chart').then(module => ({ default: module.ChartTooltipContent })));
export const ChartLegend = lazy(() => import('./ui/chart').then(module => ({ default: module.ChartLegend })));
export const ChartLegendContent = lazy(() => import('./ui/chart').then(module => ({ default: module.ChartLegendContent })));

// Lazy load complex list components
export const ClientList = lazy(() => import('./ClientList').then(module => ({ default: module.ClientList })));