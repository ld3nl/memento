import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import BackButton from '../../components/BackButton'
import { BurstScene } from '../../components/BurstScene/BurstScene'
import { LifeTable } from '../../components/LifeTable/LifeTable'
import ViewToggle from '../../components/ViewToggle'
import { calculateFullAge } from '../../lib/date-utils'
import { isValidDate } from '../../lib/validation'

type ViewMode = 'table' | 'burst'

// Define the structure for your route params
interface Props {
  params: Promise<{ view: string; params?: string[] }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  // Extract the birth date from params
  const awaitedParams = await params
  const view = awaitedParams?.view as ViewMode
  const dateParams = awaitedParams?.params

  // For URLs like /table/1987/12/17 or /burst/1987/12/17
  const urlDateParam = dateParams?.join(',') || ''
  const urlPath = dateParams?.join('/') || ''

  const ageData = calculateFullAge(urlDateParam, 'yyyy,MM,dd')

  // Handle invalid date
  if (!ageData) {
    return {
      title: 'Your Life in Weeks - Memento Mori',
      description: 'Visualize your life in weeks with Memento Mori.',
    }
  }

  const age = ageData.years
  const weeksLived = ageData.years * 52 + Math.floor(ageData.days / 7)
  const potentialYearsLeft = Math.max(80 - age, 0)
  const viewTitle = view === 'burst' ? 'Burst View' : 'Table View'

  const baseUrl = 'https://memento-mori.vercel.app'
  const canonicalUrl = `${baseUrl}/${view}${urlPath ? `/${urlPath}` : ''}`

  return {
    title: `Your Life in Weeks - Age ${age} - ${viewTitle} - Memento Mori`,
    description: `How many weeks have you lived? At ${age} years old, you've lived approximately ${weeksLived} weeks. Visualize your life ${view === 'burst' ? 'as a radial burst' : 'in a table grid'} with ${potentialYearsLeft} years potentially remaining. Make every week count.`,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: `Your Life in Weeks - Age ${age} - ${viewTitle}`,
      description: `At ${age} years old, you've lived approximately ${weeksLived} weeks. Visualize your life ${view === 'burst' ? 'as a radial burst' : 'in a table grid'}, with approximately ${potentialYearsLeft} years potentially left.`,
      url: canonicalUrl,
      type: 'website',
      images: [
        {
          url: 'https://utfs.io/f/vfxFGWyJBql9tjBcWhLA6EWr7SI90xRVulwdUhnPDQs8kcH3',
          width: 730,
          height: 548,
          alt: 'Memento Mori Life Calendar Visualization',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: `Your Life in Weeks - Age ${age} - ${viewTitle}`,
      description: `At ${age} years old, you've lived approximately ${weeksLived} weeks. Visualize your life ${view === 'burst' ? 'as a radial burst' : 'in a table grid'}.`,
      images: [
        'https://utfs.io/f/vfxFGWyJBql9tjBcWhLA6EWr7SI90xRVulwdUhnPDQs8kcH3',
      ],
    },
  }
}

const ViewPage = async ({ params }: Props) => {
  // A small delay to simulate fetching or some async operations
  await new Promise((resolve) => setTimeout(resolve, 500))

  // Await params before using its properties to avoid errors
  const awaitedParams = await params
  const view = awaitedParams?.view as ViewMode
  const dateParams = awaitedParams?.params

  // Validate view parameter
  if (!view || !['table', 'burst'].includes(view)) {
    notFound()
  }

  // Extract birth date from remaining params (e.g., ["1987", "12", "17"])
  const urlDateParam = dateParams?.join(',') || ''
  const birthDate = new Date(urlDateParam)

  if (!isValidDate(birthDate)) {
    notFound()
  }

  return (
    <div className="group m-auto p-2">
      <BackButton />
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-center font-serif text-2xl leading-8 font-semibold tracking-wide text-primary">
          Memento Mori
        </h1>
        {/* View toggle positioned in top right - but hidden since we're directly on a view */}
        <div className="hidden">
          <ViewToggle currentView={view} onViewChange={() => {}} />
        </div>
      </div>

      {view === 'table' ? (
        <LifeTable dob={birthDate} />
      ) : (
        <div className="relative h-[80vh] w-full">
          <BurstScene
            dob={birthDate}
            shape="circle"
            itemSizeRem={0.15}
            itemSpacingRem={0.1}
          />
        </div>
      )}
    </div>
  )
}

export default ViewPage
