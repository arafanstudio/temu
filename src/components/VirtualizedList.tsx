import React from 'react';
import { FixedSizeList as List } from 'react-window';

interface VirtualizedListProps<T> {
  items: T[];
  height: number;
  itemHeight: number;
  renderItem: (props: { index: number; style: React.CSSProperties; data: T[] }) => React.ReactElement;
  className?: string;
}

export default function VirtualizedList<T>({
  items,
  height,
  itemHeight,
  renderItem,
  className = ''
}: VirtualizedListProps<T>) {
  if (items.length === 0) {
    return (
      <div className={`flex items-center justify-center ${className}`} style={{ height }}>
        <p className="text-gray-500">Tidak ada data</p>
      </div>
    );
  }

  return (
    <div className={className}>
      <List
        height={height}
        itemCount={items.length}
        itemSize={itemHeight}
        itemData={items}
        overscanCount={5} // Render 5 extra items for smooth scrolling
      >
        {renderItem}
      </List>
    </div>
  );
}

