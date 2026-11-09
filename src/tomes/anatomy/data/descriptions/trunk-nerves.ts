import type { Description } from './index'

/**
 * The nerves of the trunk (nervous viewer): spinal roots and ganglia, intercostal nerves, the abdominal branches of L1 and
 * the thoracic sympathetic trunk, after Latarjet–Ruiz Liard's chapters 23, 37–39 and 41 (t. 1).
 */

const LR = (p: string) => ({ fuente: 'latarjet-ruiz-1' as const, p })
const d = (p: string, ...text: string[]): Description => ({ text, sources: [LR(p)] })

const SYMPATHETIC_TRUNK =
  'Cadena de ganglios a cada lado de la columna, de la base del cráneo al cóccix, donde se une con la del otro lado en el ganglio impar. En el tórax es laterovertebral, delante de las articulaciones costovertebrales y cubierta por la pleura, y tiene un ganglio aplanado por vértebra. Cada ganglio se une al nervio espinal por dos **ramos comunicantes**: el blanco, de fibras preganglionares mielínicas (sólo de T1 a L2), y el gris, de fibras posganglionares que vuelven al nervio.'

const nerves: Record<string, Description> = {
  'Anterior root of spinal nerve': d(
    '143–145, 363',
    'La **raíz anterior** o ventral de cada nervio espinal: fibras **motoras** que salen del asta anterior de la médula (y, de T1 a L2, las preganglionares simpáticas del asta lateral). Atraviesa la duramadre por su propio orificio y se une a la raíz posterior en el foramen intervertebral, más allá del ganglio espinal. Hacia abajo las raíces son cada vez más oblicuas, hasta formar la cola de caballo.',
  ),
  'Posterior root of spinal nerve': d(
    '143–145, 363',
    'La **raíz posterior** o dorsal de cada nervio espinal: fibras **sensitivas** que llevan a la médula lo que se siente en la piel, los músculos y las vísceras. A 1 cm de la médula se ensancha en el **ganglio espinal**, donde están los cuerpos de sus neuronas, y en el foramen intervertebral se une a la raíz anterior para formar el nervio espinal.',
  ),
  'Spinal ganglion': d(
    '48, 143, 145, 384',
    'El ensanchamiento de la raíz posterior junto al foramen intervertebral, dentro de una vaina dural: contiene los cuerpos de las neuronas sensitivas seudounipolares, cuya prolongación periférica va con el nervio y la central entra en la médula. Ocupa el foramen con las raíces, a las que comprimen allí las hernias discales que salen hacia atrás y afuera.',
  ),
  'Cauda equina': d(
    '143–145',
    'La **cola de caballo**: el haz de raíces lumbares, sacras y coccígeas que, como la médula termina hacia el disco L1–L2, bajan verticales por el saco dural hasta sus forámenes, alrededor del filum terminal.',
  ),
  'Spinal dura': d(
    '144–145',
    'La **duramadre espinal**, tubo fibroso grueso y poco extensible del foramen magno a la 2.ª–3.ª vértebra sacra, donde forma el **fondo de saco dural** que contiene la cola de caballo. La separa del conducto vertebral el **espacio epidural**, con grasa y los plexos venosos vertebrales internos, donde se inyecta la anestesia epidural; se prolonga en vainas alrededor de cada nervio espinal.',
  ),
  'Intercostal nerves': d(
    '348–349, 365–366',
    'Los **ramos anteriores** de los doce nervios torácicos, los únicos que no forman plexo. Cada uno recibe un ramo comunicante del tronco simpático y corre por el espacio intercostal, bajo el surco costal, debajo de la arteria y la vena, entre el intercostal interno y el íntimo. Inervan los músculos intercostales, los elevadores de las costillas y el transverso del tórax, la pleura y, por sus ramos cutáneos lateral y anterior, la piel del tórax.',
    'Los seis primeros terminan junto al esternón; los seis últimos pasan a la pared del abdomen entre el oblicuo interno y el transverso e inervan los músculos anchos, el recto y la piel del abdomen. El duodécimo, bajo la última costilla, es el **nervio subcostal**. Los ramos posteriores de los mismos nervios torácicos inervan los músculos y la piel del dorso.',
  ),
  'Iliohypogastric nerve': d(
    '351',
    'Ramo del primer nervio lumbar que sale por el borde lateral del psoas, cruza por delante del cuadrado lumbar y detrás del riñón, y corre entre el transverso y el oblicuo interno. Da un ramo cutáneo lateral para la piel de la nalga, inerva los tres músculos anchos y el recto, y termina en la piel de la región **púbica** sobre el anillo inguinal superficial.',
  ),
  'Ilio-inguinal nerve': d(
    '351',
    'Ramo del primer nervio lumbar (a menudo de L2), por debajo del iliohipogástrico y paralelo a él entre el transverso y el oblicuo interno. Inerva los músculos anchos de la parte baja de la pared, entra en el **conducto inguinal** y sale por el anillo superficial para dar la piel del pubis y del escroto o de los labios mayores.',
  ),
  'Sympathetic trunk': d(
    '363–364, 371–374',
    SYMPATHETIC_TRUNK,
    'En el tórax recibe por los ramos blancos las fibras preganglionares de la médula y las reparte: unas vuelven a los nervios intercostales (vasos, sudor y pelos de la pared), otras van al corazón, el pulmón y el esófago, y otras lo atraviesan sin sinapsis para formar los **nervios esplácnicos**, que bajan al plexo celíaco.',
  ),
  'Ganglia of sympathetic trunk': d(
    '363–371',
    'Los ganglios del tronco simpático, donde hacen sinapsis la mayoría de las fibras preganglionares y nacen las posganglionares. Son menos que los nervios espinales por fusión: en el cuello, el superior, el medio (inconstante) y el inferior, unido en tres de cada cuatro casos al primero torácico en el **ganglio estrellado**, frente al cuello de la 1.ª costilla; en el tórax, uno por vértebra.',
    SYMPATHETIC_TRUNK,
  ),
  'Sympathetic nerves': d(
    '371–374',
    'Los nervios que salen de los ganglios simpáticos hacia las vísceras y los vasos. En el tórax: ramos para el corazón, el pulmón, el esófago y la aorta, y los **nervios esplácnicos**: el mayor (ganglios 5.º a 9.º), el menor (9.º a 11.º) y el imo (12.º). Éstos son en realidad fibras preganglionares que cruzan el diafragma y hacen sinapsis en los ganglios celíacos y aorticorrenales; llevan también la sensibilidad de las vísceras abdominales.',
  ),
}

export const trunkNerves = nerves
