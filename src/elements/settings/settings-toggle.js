import { Link, useLocation } from 'react-router-dom'
import './settings-toggle.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faGear, faHouse } from '@fortawesome/free-solid-svg-icons'

function SettingsToggle(props) {
    const location = useLocation();
    const config = location.pathname.match(/\/earthquake-catalog-ui\/?$/i) ? {
        destination: '/earthquake-catalog-ui/settings',
        icon: faGear
    } : {
        destination: '/earthquake-catalog-ui',
        icon: faHouse
    };
    return (
        <Link to={config.destination} className="action-icon">
            <FontAwesomeIcon icon={config.icon} />
        </Link>
    );
}

export default SettingsToggle;
