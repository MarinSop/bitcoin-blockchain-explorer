import React, { Fragment } from 'react';
import { Link } from 'react-router-dom';

export interface BreadcrumbItem {
  label: string | React.ReactNode;
  to?: string;
}

interface Props {
  items: BreadcrumbItem[];
}

export function Breadcrumb({ items }: Props) {
  return (
    <nav className="flex items-center flex-wrap gap-2 text-dark-muted mb-6 text-sm font-medium">
      {items.map((item, index) => {
        const isLast = index === items.length - 1;

        return (
          <Fragment key={index}>
            {isLast ? (
              <span
                className="text-white truncate max-w-[300px]"
                title={typeof item.label === 'string' ? item.label : ''}
              >
                {item.label}
              </span>
            ) : (
              <Link
                to={item.to || '#'}
                className="hover:text-primary transition-colors whitespace-nowrap"
              >
                {item.label}
              </Link>
            )}
            {!isLast && <span className="text-dark-muted/50 select-none">/</span>}
          </Fragment>
        );
      })}
    </nav>
  );
}
