import React, { Suspense, lazy } from 'react';
import LoadingSpinner from './LoadingSpinner';

// Lazy loading per componenti pesanti
export const LazyPropertyPosterGenerator = lazy(() => import('./PropertyPosterGenerator'));
export const LazyPortalPublisher = lazy(() => import('./PortalPublisher'));
export const LazyPropertyManager = lazy(() => 
  import('./PropertyManager').then(module => ({ default: module.PropertyManager }))
);
export const LazyEditingPropertyManager = lazy(() => 
  import('./EditingPropertyManager').then(module => ({ default: module.EditingPropertyManager }))
);

// Wrapper con Suspense per gestire il loading
interface LazyWrapperProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export const LazyWrapper: React.FC<LazyWrapperProps> = ({ 
  children, 
  fallback = <LoadingSpinner /> 
}) => {
  return (
    <Suspense fallback={fallback}>
      {children}
    </Suspense>
  );
};

// Componenti wrapper pronti all'uso
export const PropertyPosterGeneratorLazy: React.FC = () => (
  <LazyWrapper>
    <LazyPropertyPosterGenerator />
  </LazyWrapper>
);

export const PortalPublisherLazy: React.FC = () => (
  <LazyWrapper>
    <LazyPortalPublisher />
  </LazyWrapper>
);

export const PropertyManagerLazy: React.FC<any> = (props) => (
  <LazyWrapper>
    <LazyPropertyManager {...props} />
  </LazyWrapper>
);

export const EditingPropertyManagerLazy: React.FC<any> = (props) => (
  <LazyWrapper>
    <LazyEditingPropertyManager {...props} />
  </LazyWrapper>
);