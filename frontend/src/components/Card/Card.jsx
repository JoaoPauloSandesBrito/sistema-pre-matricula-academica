import Icon from '../Icon/Icon';
import './Card.css';

const iconsByVariant = {
  blue: 'groups',
  green: 'menu_book',
  amber: 'assignment_turned_in',
  purple: 'event_available',
  slate: 'chair',
};

export default function Card({
  titulo,
  valor,
  descricao,
  variante = 'blue',
  icon,
}) {
  const iconName = icon || iconsByVariant[variante] || 'analytics';

  return (
    <article className={`summary-card ${variante}`}>
      <div className="summary-card-header">
        <p>{titulo}</p>
        <Icon name={iconName} className="summary-card-icon" />
      </div>

      <strong>{valor}</strong>
      <span>{descricao}</span>
    </article>
  );
}
