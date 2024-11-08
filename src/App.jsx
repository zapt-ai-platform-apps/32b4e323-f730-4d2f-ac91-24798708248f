import { createSignal, onMount, createEffect, Show } from 'solid-js';
import { createEvent, supabase } from './supabaseClient';
import { Auth } from '@supabase/auth-ui-solid';
import { ThemeSupa } from '@supabase/auth-ui-shared';

function App() {
  const [user, setUser] = createSignal(null);
  const [currentPage, setCurrentPage] = createSignal('login');
  const [tokenPairInfo, setTokenPairInfo] = createSignal('');
  const [tradeRouteInstructions, setTradeRouteInstructions] = createSignal('');
  const [generatedContract, setGeneratedContract] = createSignal('');
  const [loading, setLoading] = createSignal(false);
  const [error, setError] = createSignal('');

  const checkUserSignedIn = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      setUser(user);
      setCurrentPage('homePage');
    }
  };

  onMount(checkUserSignedIn);

  createEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_, session) => {
      if (session?.user) {
        setUser(session.user);
        setCurrentPage('homePage');
      } else {
        setUser(null);
        setCurrentPage('login');
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  });

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setCurrentPage('login');
  };

  const handleGenerateContract = async () => {
    setLoading(true);
    setError('');
    setGeneratedContract('');
    try {
      const prompt = `Generate a functional, efficient, and error-free Solidity smart contract code that, when deployed, will execute a flash loan to arbitrage trade the provided token pair via the provided route, repay the flash loan, and transfer the profits to the user's wallet, all within the same transaction block. Use the following details:

Token Pair Info:
${tokenPairInfo()}

Trade Route Instructions:
${tradeRouteInstructions()}

Ensure that the contract includes all necessary safety checks and is optimized for gas efficiency. Return only the Solidity code without any explanations.`;

      const result = await createEvent('chatgpt_request', {
        prompt,
        response_type: 'text',
      });

      setGeneratedContract(result);
    } catch (error) {
      console.error('Error generating contract:', error);
      setError('An error occurred while generating the smart contract.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div class="min-h-screen bg-gradient-to-br from-purple-100 to-blue-100 p-4">
      <Show
        when={currentPage() === 'homePage'}
        fallback={
          <div class="flex items-center justify-center min-h-screen">
            <div class="w-full max-w-md p-8 bg-white rounded-xl shadow-lg">
              <h2 class="text-3xl font-bold mb-6 text-center text-purple-600">Sign in with ZAPT</h2>
              <a
                href="https://www.zapt.ai"
                target="_blank"
                rel="noopener noreferrer"
                class="text-blue-500 hover:underline mb-6 block text-center"
              >
                Learn more about ZAPT
              </a>
              <Auth
                supabaseClient={supabase}
                appearance={{ theme: ThemeSupa }}
                providers={['google', 'facebook', 'apple']}
                magicLink={true}
              />
            </div>
          </div>
        }
      >
        <div class="max-w-4xl mx-auto">
          <div class="flex justify-between items-center mb-8">
            <h1 class="text-4xl font-bold text-purple-600">Flash Loan Arbitrage Generator</h1>
            <button
              class="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-6 rounded-full shadow-md focus:outline-none focus:ring-2 focus:ring-red-400 transition duration-300 ease-in-out transform hover:scale-105 cursor-pointer"
              onClick={handleSignOut}
            >
              Sign Out
            </button>
          </div>

          <div class="bg-white p-6 rounded-lg shadow-md">
            <h2 class="text-2xl font-bold mb-4 text-purple-600">Generate Smart Contract</h2>
            <div class="space-y-4">
              <textarea
                placeholder="Enter Token Pair Info"
                value={tokenPairInfo()}
                onInput={(e) => setTokenPairInfo(e.target.value)}
                class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-400 focus:border-transparent box-border h-24 text-gray-800"
              />
              <textarea
                placeholder="Enter Trade Route Instructions"
                value={tradeRouteInstructions()}
                onInput={(e) => setTradeRouteInstructions(e.target.value)}
                class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-400 focus:border-transparent box-border h-24 text-gray-800"
              />
              <button
                onClick={handleGenerateContract}
                class={`w-full px-6 py-3 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition duration-300 ease-in-out transform hover:scale-105 ${
                  loading() ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
                }`}
                disabled={loading()}
              >
                <Show when={loading()} fallback="Generate Smart Contract">
                  Generating...
                </Show>
              </button>
              <Show when={error()}>
                <p class="text-red-500">{error()}</p>
              </Show>
            </div>
          </div>

          <Show when={generatedContract()}>
            <div class="mt-8 bg-white p-6 rounded-lg shadow-md">
              <h3 class="text-xl font-bold mb-4 text-purple-600">Generated Smart Contract</h3>
              <pre class="overflow-x-auto bg-gray-100 p-4 rounded-lg">
                <code>{generatedContract()}</code>
              </pre>
            </div>
          </Show>
        </div>
      </Show>
    </div>
  );
}

export default App;