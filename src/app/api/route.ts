interface YieldsInterface {
    date: Date
    apy: number
    implicit_apy: number
  }
  
export async function GET() {
    const response = await fetch(
      'https://metronome-indexer.onrender.com/api/v1/nststrk_yields',
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      },
    )
    if (response.status !== 200) {
      return Response.json({ error: 'Error fetching yields' })
    }
    const yields: YieldsInterface[] = await response.json()
    const formatedYields = yields.map((yieldData, index) => {
        return {
            date: index + 1,
            Implied: yieldData.apy,
            Underlying: yieldData.implicit_apy,
        }
        }
    )
    return Response.json(formatedYields)
  }