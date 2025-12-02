import { render, screen } from '@testing-library/react';
import { Card } from '../Card';

describe('Card', () => {
  it('renders children correctly', () => {
    render(<Card>Card Content</Card>);
    expect(screen.getByText('Card Content')).toBeInTheDocument();
  });

  it('renders with title', () => {
    render(<Card title="Card Title">Content</Card>);
    expect(screen.getByText('Card Title')).toBeInTheDocument();
  });

  it('renders with description', () => {
    render(<Card description="Card Description">Content</Card>);
    expect(screen.getByText('Card Description')).toBeInTheDocument();
  });

  it('renders with footer', () => {
    render(<Card footer={<div>Footer Content</div>}>Content</Card>);
    expect(screen.getByText('Footer Content')).toBeInTheDocument();
  });

  it('renders with header action', () => {
    render(
      <Card
        title="Title"
        headerAction={<button>Action</button>}
      >
        Content
      </Card>
    );
    expect(screen.getByText('Action')).toBeInTheDocument();
  });

  it('applies different variants', () => {
    const { container } = render(<Card variant="elevated">Content</Card>);
    const card = container.firstChild;
    expect(card).toHaveClass('shadow-lg');
  });

  it('applies hoverable class when hoverable is true', () => {
    const { container } = render(<Card hoverable>Content</Card>);
    const card = container.firstChild;
    expect(card).toHaveClass('hover:shadow-md');
  });

  it('applies different padding sizes', () => {
    const { container } = render(<Card padding="lg">Content</Card>);
    const card = container.firstChild;
    expect(card).toHaveClass('p-8');
  });
});
