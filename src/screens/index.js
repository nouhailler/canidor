import Home from './Home'
import Tools from './Tools'
import Profile from './Profile'
import Carnet from './Carnet'
import Settings from './Settings'
import { Identify, Morpho, Compare, Fiche, Catalogue, Worldmap, Genetics } from './identity'
import { Behavior, Psy, Translate, Bodylang, Whydog, Barkprevent, Barkrecog } from './behavior'
import { HealthPhoto, Weight, Agehuman, Pain, Predictive, Vetprep, Nutrition, Recipes } from './health'
import { Coach, Activities, Weatherprog, Walkroute, Mentalex, Activitylevel } from './activity'
import { Lifestyle, Compat, Dogcompat, Simulator } from './adoption'
import { Timeline, Twin, Pedigree } from './advanced'

const REGISTRY = {
  home: Home,
  tools: Tools,
  profile: Profile,
  carnet: Carnet,
  settings: Settings,
  // identité & races
  identify: Identify,
  morpho: Morpho,
  compare: Compare,
  fiche: Fiche,
  catalogue: Catalogue,
  worldmap: Worldmap,
  genetics: Genetics,
  // comportement & langage
  behavior: Behavior,
  psy: Psy,
  translate: Translate,
  bodylang: Bodylang,
  whydog: Whydog,
  barkprevent: Barkprevent,
  barkrecog: Barkrecog,
  // santé & prévention
  healthphoto: HealthPhoto,
  weight: Weight,
  agehuman: Agehuman,
  pain: Pain,
  predictive: Predictive,
  vetprep: Vetprep,
  nutrition: Nutrition,
  recipes: Recipes,
  // activité & éducation
  coach: Coach,
  activities: Activities,
  weatherprog: Weatherprog,
  walkroute: Walkroute,
  mentalex: Mentalex,
  activitylevel: Activitylevel,
  // adoption & compatibilité
  lifestyle: Lifestyle,
  compat: Compat,
  dogcompat: Dogcompat,
  simulator: Simulator,
  // suivi & avancé
  timeline: Timeline,
  twin: Twin,
  pedigree: Pedigree,
}

export function getScreen(id) {
  return REGISTRY[id] || Home
}
