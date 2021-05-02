import { library as FontAwesomeLibrary } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import {
  faBackspace, faTimes, faCog, faUser, faKey, faUsers, faGifts, faReceipt, faBook, faBarcode, faBars, faEye, faEyeSlash,
  faMapMarkerAlt, faDesktop, faArrowAltCircleRight, faEdit, faTrash, faEnvelope, faMap, faMapMarkedAlt, faMoneyBillAlt,
  faCreditCard, faCommentDollar, faTicketAlt, faCircleNotch, faPrint, faReply, faPhone
} from '@fortawesome/free-solid-svg-icons'

FontAwesomeLibrary.add(
  faBackspace, faTimes, faCog, faUser, faKey, faUsers, faGifts, faReceipt, faBook, faBarcode, faBars, faEye, faEyeSlash,
  faMapMarkerAlt, faDesktop, faArrowAltCircleRight, faEdit, faTrash, faEnvelope, faMap, faMapMarkedAlt, faMoneyBillAlt,
  faCreditCard, faCommentDollar, faTicketAlt, faCircleNotch, faPrint, faReply, faPhone
);

export default FontAwesomeIcon
