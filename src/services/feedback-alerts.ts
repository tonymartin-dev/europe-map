import { alertController } from '@ionic/core';

export const successAlert = async (extraMsg?: string, onClose?: () => void) => {
  const alertRef = await alertController.create({
    header: 'Correcto',
    message: `¡Has acertado! 😀${extraMsg ? '\n' + extraMsg : ''}`,
    buttons: ['Continuar']
  })

  await alertRef.present()

  if(onClose) {
    alertRef.onDidDismiss().then(onClose);
  }
}

export const failAlert = async (onClose?: () => void) => {
  const alertRef = await alertController.create({
    header: 'Error',
    message: 'Oh, has fallado 🙁  ¡Inténtalo de nuevo!',
    buttons: ['Continuar']
  })

  await alertRef.present()

  if(onClose) {
    alertRef.onDidDismiss().then(onClose);
  }
}
